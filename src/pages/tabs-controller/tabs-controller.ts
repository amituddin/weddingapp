import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UndanganPernikahanPage } from '../undangan-pernikahan/undangan-pernikahan';
import { DataUndanganPage } from '../data-undangan/data-undangan';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase/app';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = HomePage;
  tab2Root: any = UndanganPernikahanPage;
  tab3Root: any = DataUndanganPage;
  constructor(public navCtrl: NavController, public authService: AuthServiceProvider) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        navCtrl.setRoot(LoginPage);
      } else {
        console.log(user.uid);
      }
    });
  }


}
