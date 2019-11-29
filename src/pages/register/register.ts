import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  users: FirebaseListObservable<any[]>;

  public registerForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  namaChanged: boolean = false;
  alamatChanged: boolean = false;
  notelpChanged: boolean = false;
  fullnameChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public toastCtrl: ToastController,
    public db: AngularFireDatabase,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      nama: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      alamat: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      notelp: ['', Validators.compose([Validators.minLength(10), Validators.required])]

    });

    // Get All Users
    this.users = db.list('/users');
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }


  // Register No Photo
  doRegister() {
    this.submitAttempt = true;

    if (!this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      this.authService.SignUp(this.registerForm.value.email, this.registerForm.value.password.toLowerCase()).then((user) => {
        var signinTime = new Date();
        this.users.update(user.uid, {
          user_email: this.registerForm.value.email.toLowerCase(),
          user_password: this.registerForm.value.password.toLowerCase(),
          user_name: this.registerForm.value.nama,
          user_alamat: this.registerForm.value.alamat,
          user_notelp: this.registerForm.value.notelp,
          user_photo: {
            downloadURL: "empty",
            fileName: "empty",
            fullPath: "empty",
            size: "empty"
          },
          user_photobuktipembayaran: {
            fullPath: "empty"
          },
          user_created: signinTime.getTime(),
          user_updated: signinTime.getTime()
        }).then(
          val => {
            let toast = this.toastCtrl.create({
              message: 'Akun anda telah dibuat!',
              duration: 5000,
              position: 'bottom'
            });
            toast.onDidDismiss(() => {
            });
            toast.present();
            this.navCtrl.setRoot(LoginPage);
          },
          error => {
            let alert = this.alertCtrl.create({
              message: "Email sudah terdaftar!",
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          })
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
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

}
