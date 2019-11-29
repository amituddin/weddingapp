import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthServiceProvider {
  private authState: Observable<firebase.User>;
  currentUser: any;

  constructor(public afAuth: AngularFireAuth) {
    this.authState = afAuth.authState;
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
    });
  }

  doLogin(Email: string, Password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(Email, Password);
  }

  SignUp(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  resetPassword(Email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(Email);
  }

  doLogout(): void {
    this.afAuth.auth.signOut();
  }
}
