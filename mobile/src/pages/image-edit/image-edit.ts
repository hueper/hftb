import { Component } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';
import { ImageService } from '../../providers/image.service';
import { Image } from '../../image';

@Component({
  selector: 'page-image-edit',
  templateUrl: 'image-edit.html'
})
export class ImageEditPage {
  public image: Image;
  public images: Image[];
  public index: number;

  constructor(public imageService: ImageService, public navCtrl: NavController, public navParams: NavParams) {
    this.image = navParams.get('image');
    this.images = navParams.get('images');
    this.index = navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageEditPage');
  }

  removeImage() {
    this.imageService.remove(this.image);
    this.navCtrl.pop();
  }

}
