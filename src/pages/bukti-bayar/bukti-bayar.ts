import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';

import { UndanganPernikahanPage } from '../undangan-pernikahan/undangan-pernikahan';

@Component({
  selector: 'page-bukti-bayar',
  templateUrl: 'bukti-bayar.html'
})
export class BuktiBayarPage {

  users: FirebaseListObservable<any[]>;

  public registerForm;
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
    public loadingCtrl: LoadingController) {

    this.registerForm = formBuilder.group({
      key: [''],
      fullPath: [''],
      file: ['']
    });

    // For Upload
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

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
                fullPath: snapshot.val().user_photobuktipembayaran.fullPath
              })
            })
          })
      }
    })
  }

  // For Upload
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  fileName: any = '';
  checkdone: any = '';
  check() {
  this.checkdone = "true";
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
      this.fileName = selectedFile.name;
    }
  }

  // For Upload
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file);
    } else if (output.type === 'uploading') {
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  // Update Image
  update(size) {
    if (!this.registerForm.valid) {
    } else {

      let storageRef = firebase.storage().ref();
      let storagePath = this.registerForm.value.fullPath;

      if (this.registerForm.value.fullPath != 'empty') {
        firebase.storage().ref().child(storagePath).delete();
      }
      for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {

        let fullPath = `/users/user_photobuktibayar/${this.registerForm.value.key}/${selectedFile.name}`;
        var iRef = storageRef.child(fullPath);
        var uploadTask = iRef.put(selectedFile);

        uploadTask.on('state_changed', function(snapshot) {
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              break;
            case firebase.storage.TaskState.RUNNING:
              break;
          }
        }, function(error) {
          console.log(error)
        }, () => {
          var timestamp = firebase.database.ServerValue.TIMESTAMP;
          this.users.update(this.registerForm.value.key, {
            user_photobuktipembayaran: {
              size: size,
              fileName: iRef.name,
              fullPath: iRef.fullPath,
              downloadURL: uploadTask.snapshot.downloadURL,
              status: "true"
            },
            user_updated: timestamp
          }).then(
            val => {
               this.navCtrl.pop();
              let toast = this.toastCtrl.create({
                message: 'Bukti Pembayaran Sudah Di Upload',
                duration: 5000,
                position: 'bottom'
              });
              toast.onDidDismiss(() => {
              });
              toast.present();
            },
            error => {
              console.log(error);
            }
            );
        });
      }
    }
  }

}
