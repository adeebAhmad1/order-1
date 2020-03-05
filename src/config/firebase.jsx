import * as firebase from 'firebase/app';

//firebase products
import "firebase/auth"
import "firebase/firestore"
// import 'firebase/databse'


const firebaseConfig = {
    apiKey: "AIzaSyB3ZP0ojgzpT_zqOiOlxtqcRSB8WAwJOmg",
    authDomain: "todo-app-7b98f.firebaseapp.com",
    databaseURL: "https://todo-app-7b98f.firebaseio.com",
    projectId: "todo-app-7b98f",
    storageBucket: "todo-app-7b98f.appspot.com",
    messagingSenderId: "290957891144",
    appId: "1:290957891144:web:69e363c2e87dd06df9aa7d"
  };

  firebase.initializeApp(firebaseConfig)

  var db = firebase.firestore()

  // var storage = firebase.storage();


  export {db}

  export default firebase