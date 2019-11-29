import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html'
})
export class UpdateProfilePage {

  users: FirebaseListObservable<any[]>;

  public registerForm;
  namaChanged: boolean = false;
  alamatChanged: boolean = false;
  notelpChanged: boolean = false;
  fullnameChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {

    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.registerForm = formBuilder.group({
      key: [''],
      nama: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      alamat: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      notelp: ['', Validators.compose([Validators.minLength(10), Validators.required])]
    });

    // Get All Users
    this.users = db.list('/users');

    // Get Auth Session
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.list('/users', {
          query: {
            orderByChild: 'user_email',
            equalTo: user.email
          },
          preserveSnapshot: true
        })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.registerForm.patchValue({
                key: snapshot.key,
                nama: snapshot.val().user_name,
                alamat: snapshot.val().user_alamat,
                notelp: snapshot.val().user_notelp
              })
            })
          })
      }
    })
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  // Update Data
  update() {
    if (!this.registerForm.valid) {
    } else {
      var changeNameTime = new Date();
      this.users.update(this.registerForm.value.key, {
        user_name: this.registerForm.value.nama,
        user_alamat: this.registerForm.value.alamat,
        user_notelp: this.registerForm.value.notelp,
        user_updated: changeNameTime.getTime()
      });
      let toast = this.toastCtrl.create({
        message: 'Data berhasil diubah',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }
}
