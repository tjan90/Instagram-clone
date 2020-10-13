import firebase from 'firebase'

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAhpbTjlXfich9QEX0YR0kOylL73-7Ve_o",
    authDomain: "instagram-clone-a1669.firebaseapp.com",
    databaseURL: "https://instagram-clone-a1669.firebaseio.com",
    projectId: "instagram-clone-a1669",
    storageBucket: "instagram-clone-a1669.appspot.com",
    messagingSenderId: "1014286536030",
    appId: "1:1014286536030:web:6fd5231a2e6a9d8ffbd3cf"
  });

  const db = firebaseConfig.firestore();
  const auth =  firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};