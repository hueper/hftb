import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { UserPage } from '../pages/user/user';
import { UploadPage } from '../pages/upload/upload';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from '../pages/login/auth.service';
import { ImageService } from '../pages/home/image.service';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    UserPage,
    UploadPage,
    TabsPage,
    AutocompletePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: LoginPage, name: 'Login', segment: 'login' },
        { component: HomePage, name: 'Home', segment: 'home' }
      ]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    UserPage,
    UploadPage,
    TabsPage,
    AutocompletePage
  ],
  providers: [
    AuthService,
    ImageService
  ]
})
export class AppModule {}
