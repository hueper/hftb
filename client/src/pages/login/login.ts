import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from './auth.service';
import { UploadPage } from '../upload/upload';
import { SignupPage } from '../signup/signup';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  usercreds = {
    name: '',
    password: ''
  };

  constructor(public navCtrl: NavController, public authservice: AuthService, public navParams: NavParams) {}

  ionViewDidLoad() {}

  login(user) {
    this.authservice.authenticate(user).then(data => {
      if (data) {
        this.navCtrl.setRoot(UploadPage);
      }
    });
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }

}
