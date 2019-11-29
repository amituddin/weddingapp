import { Component, EventEmitter, Inject  } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';

import { BuktiBayarPage } from '../bukti-bayar/bukti-bayar';

import * as jsPDF from 'jspdf'

@Component({
  selector: 'page-data-undangan',
  templateUrl: 'data-undangan.html',
  providers: [
    { provide: 'Window',  useValue: window }
  ]
})
export class DataUndanganPage {

  public Form;
  public FormHarga;

  users: FirebaseListObservable<any[]>;
  hargaundangan: FirebaseListObservable<any[]>;
  undangan: FirebaseListObservable<any[]>;
  

  loading: any;
  
    downloadURL: any;

    constructor(
      public navCtrl: NavController,
      public db: AngularFireDatabase,
      public afAuth: AngularFireAuth,
      public authService: AuthServiceProvider,
      public alertCtrl: AlertController,
      public toastCtrl: ToastController,
      public formBuilder: FormBuilder,
      @Inject('Window') private window: Window,
      public loadingCtrl: LoadingController) {
    // Form

    this.FormHarga = formBuilder.group({
      key: [''],
     harga: [0]
   });


    this.db.list('/hargaundangan', {
      query: {
        orderByChild: 'id',
        equalTo : 1
      },
      preserveSnapshot: true
    })
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.FormHarga.patchValue({
            key: snapshot.key,
            harga: snapshot.val().harga
          })
        })
      })

   this.Form = formBuilder.group({
       key: [''],
      jumlah: [0, Validators.required],
      harga: [0, Validators.required]
    });

    this.Form.controls['jumlah'].valueChanges.subscribe((value) => {
      this.Form.patchValue({
        harga: value * this.FormHarga.value.harga
      });
    });

    // Get Auth Session
    afAuth.authState.subscribe(user => {
      if (user) {
        this.Form.patchValue({
          key: user.uid
        });
        this.undangan = this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          }
        }) as FirebaseListObservable<any[]>;
        this.users = this.db.list('/users', {
          query: {
            orderByChild: 'user_email',
            equalTo: user.email
          }
        }) as FirebaseListObservable<any[]>;
      }
    });
  }


  pesan() {
      if (!this.Form.valid) {
      } else {
        this.users.update(this.Form.value.key, {
          jumlah: this.Form.value.jumlah,
          harga: this.Form.value.harga,
          buktipembayaran: "true"
        });
        let toast = this.toastCtrl.create({
          message: 'Silahkan upload bukti pembayaran',
          duration: 5000,
          position: 'bottom'
        });
        toast.onDidDismiss(() => {
        });
        toast.present();
      }
    }

   upload()  {
    this.navCtrl.push(BuktiBayarPage);
   }
   
   batal() {
    if (!this.Form.valid) {
    } else {
      this.users.update(this.Form.value.key, {
        jumlah: 0,
        harga: 0,
        buktipembayaran: "false"
      });
      this.Form.patchValue({
        jumlah: 0,
        harga: 0
      });
      let toast = this.toastCtrl.create({
        message: 'Pesanan Anda Di batalkan',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  
  download() {
    
        }
}