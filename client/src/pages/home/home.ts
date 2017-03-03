import { Component } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ImageService } from './image.service';
import 'rxjs/add/operator/last';

export interface Image {
  _id: number | string;
  createdAt: number;
  filename: string;
  size: string;
  location: string;
  date: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: Observable<Image[]>;
  singleImage$: Observable<Image>;
  items: string[];
  private baseUrl: string;

  constructor(public navCtrl: NavController, private imageService: ImageService) {
    this.baseUrl = 'http://hftb.eu/';
  }

  ngOnInit() {
    this.images = this.imageService.images;
    //this.singleImage$ = this.imageService.images
    //  .map(images => images.find(item => item._id === '1'));

    //this.imageService.loadInfiniteScroll('filename', 'ASC', '');

    this.imageService.loadAll();
    /*
    this.imageService.load('1');
    */
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    //var getLastValue = this.images;
    setTimeout(() => {
      this.imageService.loadInfiniteScroll('createdAt', 'ASC', '');
      infiniteScroll.complete();
    }, 1600);
  }

}
