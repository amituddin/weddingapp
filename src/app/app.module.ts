import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UndanganPernikahanPage } from '../pages/undangan-pernikahan/undangan-pernikahan';
import { DataUndanganPage } from '../pages/data-undangan/data-undangan';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
import { ImageProfilePage } from '../pages/image-profile/image-profile';
import { BuktiBayarPage } from '../pages/bukti-bayar/bukti-bayar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../firebase/firebase';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';

// Upload
import { NgUploaderModule } from 'ngx-uploader';

// RXJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    UndanganPernikahanPage,
    DataUndanganPage,
    TabsControllerPage,
    UserProfilePage,
    LoginPage,
    RegisterPage,
    ResetpwdPage,
    UpdateProfilePage,
    ImageProfilePage,
    BuktiBayarPage
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    NgUploaderModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    UndanganPernikahanPage,
    DataUndanganPage,
    TabsControllerPage,
    UserProfilePage,
    LoginPage,
    RegisterPage,
    ResetpwdPage,
    UpdateProfilePage,
    ImageProfilePage,
    BuktiBayarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
  ]
})
export class AppModule { }
