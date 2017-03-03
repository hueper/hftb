import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Image } from '../image';
import { ENV } from '../environments/environment.dev';

import 'rxjs/add/operator/map';

@Injectable()
export class ImageService {
  images: Observable<Image[]>
  private _images: BehaviorSubject<Image[]>;
  private baseUrl: string;
  private dataStore: {
    images: Image[]
  };

  constructor(
    private http: Http
  ) {
    this.baseUrl = ENV.API_URL;
    this.dataStore = { images: [] };
    this._images = <BehaviorSubject<Image[]>>new BehaviorSubject([]);
    this.images = this._images.asObservable();
  }

  loadAll() {
    this.http.get(`${this.baseUrl}/images`)
    .map(response => response.json())
    .subscribe(data => {
      this.dataStore.images = data.images;
      console.log(this.dataStore.images);
      this._images.next(Object.assign({}, this.dataStore).images);
    }, error => console.log('Could not load images.'));
  }

  loadInfiniteScroll(sortBy: string, order: string, id: number | string) {
    let lastElementId = this._images.getValue()[this._images.getValue().length-1]._id;

    this.http.get(`${this.baseUrl}/images/${sortBy}/${order}/${lastElementId}`)
    .map(response => response.json())
    .subscribe(data => {

      for (var i = 0; i < data.images.length; i++) {
        this.dataStore.images.push(data.images[i]);
      }
      //this.dataStore.images.push(data.images);
      console.log(this.dataStore.images);
      this._images.next(Object.assign({}, this.dataStore).images);
    }, error => console.log('Could not load more images'));
  }

  load(id: number | string) {
    this.http.get(`${this.baseUrl}/images/${id}`).map(response => response.json()).subscribe(data => {
      let notFound = true;

      this.dataStore.images.forEach((item, index) => {
        if (item._id === data.id) {
          this.dataStore.images[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.images.push(data);
      }

      this._images.next(Object.assign({}, this.dataStore).images);
    }, error => console.log('Could not load image.'));
  }

  create(image: Image) {
    this.http.post(`${this.baseUrl}/images`, JSON.stringify(image))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.images.push(data);
        this._images.next(Object.assign({}, this.dataStore).images);
      }, error => console.log('Could not create image.'));
  }

  update(image: Image) {
    this.http.put(`${this.baseUrl}/images/${image._id}`, JSON.stringify(image))
      .map(response => response.json()).subscribe(data => {
        this.dataStore.images.forEach((t, i) => {
          if (t._id === data.id) { this.dataStore.images[i] = data; }
        });

        this._images.next(Object.assign({}, this.dataStore).images);
      }, error => console.log('Could not update image.'));
  }

  remove(image: Image) {
    return this.http.delete(`${this.baseUrl}/images/${image._id}`)
    .subscribe(response => {
      this.dataStore.images.forEach((t, i) => {
        if (t._id === image._id) { this.dataStore.images.splice(i, 1); }
      });
      this._images.next(Object.assign({}, this.dataStore).images);
    }, error => console.log('Could not delete image.'));
  }

  removeAllImages() {
    return this.http.get(`${this.baseUrl}/images/removeAllImages`)
    .map(response => response.json());
  }
}
