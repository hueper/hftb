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
import { AuthService } from '../../providers/auth.service';
import { FileUploadService } from '../../providers/fileupload.service';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { ENV } from '../../environments/environment.dev';

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
  images: any;
  uploadProgress: number;
  isSubmitted: boolean;
  uploadRoute: string;
  progressBarVisibility: boolean;

  constructor(
    public http: Http,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public authService: AuthService,
    public fileUpload: FileUploadService,
    public loadingCtrl: LoadingController) {
    this.baseUrl = ENV.API_URL;
    this.images = new Array<File>();
    this.uploadRoute = this.baseUrl + '/upload';
  }

  showAddressModal() {
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

  public uploadImageXHR(imageMetaData) {

  }

  public inputChangeHandler (fileInput: any) {
    let FileList: FileList = fileInput.target.files;
    this.images.length = 0;
    for (let i = 0, length = FileList.length; i < length; i++) {
      this.images.push(FileList.item(i));
    }
    // to display preview before uploading
    this.pathForImage(fileInput.target.files[0]);

    this.progressBarVisibility = true;
  }

  /*
   * Upload image without Cordova plugins
   */
  public makeXMLHttpRequest (imageMetaData) {
    let result: any;

    if (!this.images.length) {
      return;
    }

    this.isSubmitted = true;

    this.fileUpload.getObserver()
      .subscribe(progress => {
        console.log(progress);
        this.uploadProgress = progress;
      });

    try {
      result = this.fileUpload.upload(this.uploadRoute, this.images).then((res) => {
        this.presentToast(res.msg);
        var fileMetaData = res.file;
        Object.assign(imageMetaData, fileMetaData);
        this.saveImageMetaData(imageMetaData);
      }, (err) => {
        console.log(err);
      });
    } catch (error) {
      document.write(error);
    }
    if (!result['file']) {
      return;
    }
  }

  /*
   * Upload image with Cordova plugins
   */
  public uploadImageCordova(imageMetaData) {
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'fileName': filename }
    };

    const fileTransfer = new Transfer();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.authService.getinfo().then((data: any) => {
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
          console.log(err);
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
      newFileName = n + '.jpg';
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(success => {
        this.lastImage = newFileName;
      })
      .catch(err => {
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
      if (this.platform.is('cordova')) {
        return cordova.file.dataDirectory + img;
      } else {
        let reader  = new FileReader();
        let preview = document.querySelector('img');
        reader.addEventListener("load", function () {
          preview.src = reader.result;
        }, false);
        if (img) {
          reader.readAsDataURL(img);
        }
      }
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
