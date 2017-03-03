import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  newcreds = {
    name: '',
    password: ''
  };
  constructor(public navCtrl: NavController, public authservice: AuthService, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('Hello Signup Page');
  }

  register(user) {
    this.authservice.adduser(user).then(data => {
      if (data) {
        var alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'User Created',
          buttons: ['ok']
        });
        alert.present();
      }
    });
  }

}
