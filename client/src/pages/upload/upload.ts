import { Component } from '@angular/core';
import {
  NavController,
  ModalController,
  NavParams,
  LoadingController,
  Loading,
  ActionSheetController,
  ToastController,
  Platform
} from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthService } from '../login/auth.service';
import { AutocompletePage } from '../autocomplete/autocomplete';

declare var cordova: any;

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  lastImage: string = null;
  loading: Loading;
  imageMetaData = {
    location: '',
    date: ''
  };
  private baseUrl: string;

  constructor(
    public http: Http,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public authservice: AuthService,
    public loadingCtrl: LoadingController) {
      this.baseUrl = 'http://hftb.eu:3334/api';
    }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      this.imageMetaData.location = data;
    });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

  private saveImageMetaData(imageMetaData) {
    var metaData = 'filename=' + imageMetaData.filename +
      '&size=' + imageMetaData.size +
      '&location=' + imageMetaData.location +
      '&date=' + imageMetaData.date;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${this.baseUrl}/images/saveImageMetaData`, metaData, { headers: headers }).subscribe(data => {
        if (data.json().success) {
          this.presentToast(data);
          this.navCtrl.push(HomePage);
          resolve(true);
        } else {
          this.presentToast(data);
          resolve(false);
        }
      });
    });
  }

  public uploadImage(imageMetaData) {
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params : {'fileName': filename}
    };

    const fileTransfer = new Transfer();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.authservice.getinfo().then((data: any) => {
      if (data.success) {
        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, `${this.baseUrl}/upload`, options).then(data => {
          this.loading.dismissAll()
          this.presentToast(data.response);
          var fileMetaData = JSON.parse(data.response).file;
          Object.assign(imageMetaData, fileMetaData);
          console.log(imageMetaData);
          this.saveImageMetaData(imageMetaData);
        }, err => {
          this.loading.dismissAll()
          this.presentToast(err.body);
        });
      } else {
        this.loading.dismissAll()
        this.presentToast('No authorization');
        this.navCtrl.push(LoginPage);
      }
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + '.jpg';
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 640,
      targetHeight: 853
    };

    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
        .then(filePath => {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = filePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

}
