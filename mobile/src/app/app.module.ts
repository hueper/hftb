import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { UserPage } from '../pages/user/user';
import { UploadPage } from '../pages/upload/upload';
import { TabsPage } from '../pages/tabs/tabs';
import { EditPage } from '../pages/edit/edit';
import { ImageEditPage } from '../pages/image-edit/image-edit';
import { AuthService } from '../providers/auth.service';
import { ImageService } from '../providers/image.service';
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
    EditPage,
    ImageEditPage,
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
    EditPage,
    ImageEditPage,
    AutocompletePage
  ],
  providers: [
    AuthService,
    ImageService
  ]
})
export class AppModule {}
