import * as firebase from 'firebase';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAiT4V1_SaZ0vmftn_-ftAwIe19eFzKzgE",
    authDomain: "dawerapp.firebaseapp.com",
    databaseURL: "https://dawerapp.firebaseio.com",
    projectId: "dawerapp",
    storageBucket: "dawerapp.appspot.com",
    messagingSenderId: "185539839396",
    appId: "1:185539839396:web:cdead77f97a6ae8afbad31"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;