import firebase from 'firebase'
import {FirebaseConfig} from './keys'
firebase.initializeApp(FirebaseConfig)

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export const databaseRef = firebase.database().ref();
export const trackhubsRef = databaseRef.child('trackhubgenerator');
export const usersRef = databaseRef.child('users');