import { Component } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ImageService } from '../../providers/image.service';
import { Image } from '../../image';
import { ENV } from '../../environments/environment.dev';
import 'rxjs/add/operator/last';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: Observable<Image[]>;
  items: string[];
  private baseUrl: string;

  constructor(public navCtrl: NavController, private imageService: ImageService) {
    this.baseUrl = ENV.URL;
  }

  ngOnInit() {
    // ?
    this.images = this.imageService.images;
    this.imageService.loadAll();

  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    setTimeout(() => {
      this.imageService.loadInfiniteScroll('createdAt', 'ASC', '');
      infiniteScroll.complete();
    }, 1600);
  }

}
