import firebase from 'firebase'

const firebaseConfig = "config here

  const db = firebaseConfig.firestore();
  const auth =  firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};
