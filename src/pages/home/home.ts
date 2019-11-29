import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { FormBuilder, Validators } from '@angular/forms';

import { UndanganPernikahanPage } from '../undangan-pernikahan/undangan-pernikahan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  undangan: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;

  public registerForm;
  public updateForm;
  public updateForm2;
  public Form1;
  public Form2;
  public Form3;

  julukanPriaChanged: boolean = false;
  julukanWanitaChanged: boolean = false;
  namaPriaChanged: boolean = false;
  namaWanitaChanged: boolean = false;
  bapakPriaChanged: boolean = false;
  ibuPriaChanged: boolean = false;
  bapakWanitaChanged: boolean = false;
  ibuWanitaChanged: boolean = false;
  alamatPriaChanged: boolean = false;
  alamatWanitaChanged: boolean = false;
  submitAttempt: boolean = false;
  submitAttempt2: boolean = false;
  submitAttempt3: boolean = false;

  constructor(public navCtrl: NavController,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {

    // Form Tema & Bahasa
    this.registerForm = formBuilder.group({
      key: [''],
      email: [''],
      tema: ['', Validators.required],
      bahasa: ['', Validators.required]
    });

    // Form Biodata
    this.updateForm = formBuilder.group({
      julukanPria: ['', Validators.required],
      julukanWanita: ['', Validators.required],
      namaPria: ['', Validators.required],
      namaWanita: ['', Validators.required],
      bapakPria: ['', Validators.required],
      ibuPria: ['', Validators.required],
      bapakWanita: ['', Validators.required],
      ibuWanita: ['', Validators.required]
    });

    // Form Jadwal & Alamat
    this.updateForm2 = formBuilder.group({
      alamatPria: ['', Validators.required],
      alamatWanita: ['', Validators.required],
      hariAkad: ['', Validators.required],
      tanggalAkad: ['', Validators.required],
      jamAkad: ['', Validators.required],
      tempatAkad: ['', Validators.required],
      hariResepsi: ['', Validators.required],
      tanggalResepsi: ['', Validators.required],
      jamResepsi: ['', Validators.required],
      tempatResepsi: ['', Validators.required]
    });

    // Update Tema & Bahasa
    this.Form1 = formBuilder.group({
      tema: ['', Validators.required],
      bahasa: ['', Validators.required]
    });

    // Update Biodata
    this.Form2 = formBuilder.group({
      julukanPria: ['', Validators.required],
      julukanWanita: ['', Validators.required],
      namaPria: ['', Validators.required],
      namaWanita: ['', Validators.required],
      bapakPria: ['', Validators.required],
      ibuPria: ['', Validators.required],
      bapakWanita: ['', Validators.required],
      ibuWanita: ['', Validators.required]
    });

    // Update Jadwal & Alamat
    this.Form3 = formBuilder.group({
      alamatPria: ['', Validators.required],
      alamatWanita: ['', Validators.required],
      hariAkad: ['', Validators.required],
      tanggalAkad: ['', Validators.required],
      jamAkad: ['', Validators.required],
      tempatAkad: ['', Validators.required],
      hariResepsi: ['', Validators.required],
      tanggalResepsi: ['', Validators.required],
      jamResepsi: ['', Validators.required],
      tempatResepsi: ['', Validators.required]
    });

    this.users = this.db.list('/users');

    // Get Auth Session
    afAuth.authState.subscribe(user => {
      if (user) {
        this.registerForm.patchValue({
          key: user.uid,
          email: user.email
        });
        this.undangan = this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          }
        }) as FirebaseListObservable<any[]>;
      }
    });
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  // Save Tema & Bahasa
  save() {
    if (!this.registerForm.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        email: this.registerForm.value.email,
        tema: this.registerForm.value.tema,
        bahasa: this.registerForm.value.bahasa,
        julukanPria: "empty",
        alamatPria: "empty"
      });
      let toast = this.toastCtrl.create({
        message: 'Data telah disimpan',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  // Save Biodata
  update() {
    if (!this.updateForm.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        julukanPria: this.updateForm.value.julukanPria,
        julukanWanita: this.updateForm.value.julukanWanita,
        namaPria: this.updateForm.value.namaPria,
        namaWanita: this.updateForm.value.namaWanita,
        bapakPria: this.updateForm.value.bapakPria,
        ibuPria: this.updateForm.value.ibuPria,
        bapakWanita: this.updateForm.value.bapakWanita,
        ibuWanita: this.updateForm.value.ibuWanita
      });
      let toast = this.toastCtrl.create({
        message: 'Data telah disimpan',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  // Save Jadwal & Alamat
  update2() {
    if (!this.updateForm2.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        alamatPria: this.updateForm2.value.alamatPria,
        alamatWanita: this.updateForm2.value.alamatWanita,
        hariAkad: this.updateForm2.value.hariAkad,
        tanggalAkad: this.updateForm2.value.tanggalAkad,
        jamAkad: this.updateForm2.value.jamAkad,
        tempatAkad: this.updateForm2.value.tempatAkad,
        hariResepsi: this.updateForm2.value.hariResepsi,
        tanggalResepsi: this.updateForm2.value.tanggalResepsi,
        jamResepsi: this.updateForm2.value.jamResepsi,
        tempatResepsi: this.updateForm2.value.tempatResepsi
      });
      this.users.update(this.registerForm.value.key, {
        status: "false",
        buktipembayaran: "false",
        user_photobuktipembayaran: {
          fullPath: "empty",
          status: "false"
        }
      });
      this.navCtrl.push(UndanganPernikahanPage);
      let toast = this.toastCtrl.create({
        message: 'Data telah disimpan',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  edit1 = 'false';
  edit2 = 'false';
  edit3 = 'false';

  // Button Update Tema & Bahasa
  ubah1() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          },
          preserveSnapshot: true
        })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.Form1.patchValue({
                tema: snapshot.val().tema,
                bahasa: snapshot.val().bahasa
              })
            })
            this.edit1 = 'true';
          })
      }
    })
  }

  // Button Update Biodata
  ubah2() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          },
          preserveSnapshot: true
        })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.Form2.patchValue({
                julukanPria: snapshot.val().julukanPria,
                julukanWanita: snapshot.val().julukanWanita,
                namaPria: snapshot.val().namaPria,
                namaWanita: snapshot.val().namaWanita,
                bapakPria: snapshot.val().bapakPria,
                ibuPria: snapshot.val().ibuPria,
                bapakWanita: snapshot.val().bapakWanita,
                ibuWanita: snapshot.val().ibuWanita
              })
            })
            this.edit2 = 'true';
          })
      }
    })
  }

  // Button Update Jadwal & Alamat
  ubah3() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.list('/undangan', {
          query: {
            orderByChild: 'email',
            equalTo: user.email
          },
          preserveSnapshot: true
        })
          .subscribe(snapshots => {
            snapshots.forEach(snapshot => {
              this.Form3.patchValue({
                alamatPria: snapshot.val().alamatPria,
                alamatWanita: snapshot.val().alamatWanita,
                hariAkad: snapshot.val().hariAkad,
                tanggalAkad: snapshot.val().tanggalAkad,
                jamAkad: snapshot.val().jamAkad,
                tempatAkad: snapshot.val().tempatAkad,
                hariResepsi: snapshot.val().hariResepsi,
                tanggalResepsi: snapshot.val().tanggalResepsi,
                jamResepsi: snapshot.val().jamResepsi,
                tempatResepsi: snapshot.val().tempatResepsi
              })
            })
            this.edit3 = 'true';
          })
      }
    })
  }

  // Button Cancel
  cancel() {
    this.edit1 = 'false';
    this.edit2 = 'false';
    this.edit3 = 'false';
  }

  // Update Tema & Bahasa
  save1() {
    if (!this.Form1.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        tema: this.Form1.value.tema,
        bahasa: this.Form1.value.bahasa
      });
      this.edit1 = 'false';
      let toast = this.toastCtrl.create({
        message: 'Data telah Diubah',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  // Update Biodata
  save2() {
    if (!this.Form2.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        julukanPria: this.Form2.value.julukanPria,
        julukanWanita: this.Form2.value.julukanWanita,
        namaPria: this.Form2.value.namaPria,
        namaWanita: this.Form2.value.namaWanita,
        bapakPria: this.Form2.value.bapakPria,
        ibuPria: this.Form2.value.ibuPria,
        bapakWanita: this.Form2.value.bapakWanita,
        ibuWanita: this.Form2.value.ibuWanita
      });
      this.edit2 = 'false';
      let toast = this.toastCtrl.create({
        message: 'Data telah Diubah',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }

  // Update Jadwal & Alamat
  save3() {
    if (!this.Form3.valid) {
    } else {
      this.undangan.update(this.registerForm.value.key, {
        alamatPria: this.Form3.value.alamatPria,
        alamatWanita: this.Form3.value.alamatWanita,
        hariAkad: this.Form3.value.hariAkad,
        tanggalAkad: this.Form3.value.tanggalAkad,
        jamAkad: this.Form3.value.jamAkad,
        tempatAkad: this.Form3.value.tempatAkad,
        hariResepsi: this.Form3.value.hariResepsi,
        tanggalResepsi: this.Form3.value.tanggalResepsi,
        jamResepsi: this.Form3.value.jamResepsi,
        tempatResepsi: this.Form3.value.tempatResepsi
      });
      this.edit3 = 'false';
      let toast = this.toastCtrl.create({
        message: 'Data telah Diubah',
        duration: 5000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
      });
      toast.present();
    }
  }
}
