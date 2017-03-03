import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { UploadPage } from '../upload/upload';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  //tab1Root: any = HomePage;
  tab1Root: any = UploadPage;
  tab2Root: any = HomePage;

  constructor() {

  }
}
