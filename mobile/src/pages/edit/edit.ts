import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { UploadPage } from '../upload/upload';
import { LoginPage } from '../login/login';
import { ImageService } from '../../providers/image.service';
import { AuthService } from '../../providers/auth.service';
import { ImageEditPage } from '../image-edit/image-edit';
import { Image } from '../../image';
import { ENV } from '../../environments/environment.dev';

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  images: Observable<Image[]>;
  private baseUrl: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public imageService: ImageService) {
    this.baseUrl = ENV.URL;
  }

  ngOnInit() {
    this.images = this.imageService.images;
  }

  removeAllImages() {
    this.authService.getinfo().then((data: any) => {
      if (data.success) {
        this.imageService.removeAllImages()
        .subscribe(data => {
          this.presentToast(data.msg);
          this.navCtrl.push(UploadPage);
        }, error => console.log('Could not remove all images.'));
      } else {
        this.presentToast('No authorization');
        this.navCtrl.push(LoginPage);
      }
    });
  }

  removeImage(image: Image, index:number) {
    this.authService.getinfo().then((data: any) => {
      if (data.success) {
        this.imageService.remove(image);
      } else {
        this.presentToast('No authorization');
        this.navCtrl.push(LoginPage);
      }
    });
  }

  navToEdit(image: Image, index: number) {
    this.navCtrl.push(ImageEditPage, {
      image: image,
      images: this.images,
      index: index
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
}
