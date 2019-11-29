import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { UpdateProfilePage } from '../update-profile/update-profile';
import { ImageProfilePage } from '../image-profile/image-profile';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {

  loading

  users: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    // Get Auth Session
    afAuth.authState.subscribe(user => {
      if (user) {
        this.users = this.db.list('/users', {
          query: {
            orderByChild: 'user_email',
            equalTo: user.email
          }
        }) as FirebaseListObservable<any[]>;
        return this.users;
      }
    });
  }

  // Reset Password
  resetPwd() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.authService.resetPassword(user.email).then(authService => {
          let toast = this.toastCtrl.create({
            message: 'Link reset password telah dikirim ke Email anda',
            duration: 5000,
            position: 'bottom'
          });
          toast.onDidDismiss(() => {
          });
          toast.present();
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
          this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
          });
          this.loading.present();
        });
      }
    })
  }

  updateProfile() {
    this.navCtrl.push(UpdateProfilePage);
  }

  updateImageProfile() {
    this.navCtrl.push(ImageProfilePage);
  }
}
