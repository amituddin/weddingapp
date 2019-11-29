import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, MenuController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { RegisterPage } from '../register/register';
import { ResetpwdPage } from '../resetpwd/resetpwd';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public menu: MenuController
  ) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.menu.swipeEnable(false);
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  resetPwd() {
    this.navCtrl.push(ResetpwdPage);
  }


  // Login
  loginUser() {
    this.submitAttempt = true;

    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authService.doLogin(this.loginForm.value.email, this.loginForm.value.password).then(authService => {
        let toast = this.toastCtrl.create({
          message: 'Anda Berhasil Login',
          duration: 5000,
          position: 'bottom'
        });
        toast.onDidDismiss(() => {
        });
        toast.present();
        this.navCtrl.push(HomePage);
        this.navCtrl.setRoot(TabsControllerPage);
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
        content: "Loading",
        duration: 3000
      });
      this.loading.present();
    }
  }
}
