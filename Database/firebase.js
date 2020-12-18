import * as firebase from 'firebase';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBbFriWu7Z3nU3DRKfcFL9oPe_3642yhGM",
    authDomain: "euphoric-stone-298423.firebaseapp.com",
    databaseURL: "https://euphoric-stone-298423-default-rtdb.firebaseio.com",
    projectId: "euphoric-stone-298423",
    storageBucket: "euphoric-stone-298423.appspot.com",
    messagingSenderId: "546499363978",
    appId: "1:546499363978:web:2e1937d9506a2819815973"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;