import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { FormBuilder, Validators } from '@angular/forms';
import { DataUndanganPage } from '../data-undangan/data-undangan';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-undangan-pernikahan',
  templateUrl: 'undangan-pernikahan.html'
})
export class UndanganPernikahanPage {

  undangan: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {

    // Get Auth Session
    afAuth.authState.subscribe(user => {
      if (user) {
        this.undangan = this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          }
        }) as FirebaseListObservable<any[]>;
      }
    });
  }

  Next(params) {
    if (!params) params = {};
    this.navCtrl.push(DataUndanganPage);
  }
}
