import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCqIecftoPuuGJUJydfZwVs92VB5gkraJ0",
  authDomain: "noxaterna1-1.firebaseapp.com",
  databaseURL: "https://noxaterna1-1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "noxaterna1-1",
  storageBucket: "noxaterna1-1.firebasestorage.app",
  messagingSenderId: "9803771791",
  appId: "1:9803771791:web:a2252c2991f1474b0325fa"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, onValue, update, push, remove };
