import * as firebase from "firebase/app";

//firebase products
import "firebase/auth";
import "firebase/firestore";
// import 'firebase/databse'

const firebaseConfig = {
  apiKey: "AIzaSyAaJ3ebj8RX0yhVKwVo0V6RVDQ4ZF71BDc",
  authDomain: "todo-3194d.firebaseapp.com",
  databaseURL: "https://todo-3194d.firebaseio.com",
  projectId: "todo-3194d",
  storageBucket: "todo-3194d.appspot.com",
  messagingSenderId: "916502017240",
  appId: "1:916502017240:web:484cd28bccd5b3747813ad"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// var storage = firebase.storage();

export { db };

export default firebase;
