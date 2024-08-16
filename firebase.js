import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWJ3oRn_OXLhHe0EVo7RG0QfD3jOqb7qA",
  authDomain: "carrot-market-afc5c.firebaseapp.com",
  databaseURL:
    "https://carrot-market-afc5c-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "carrot-market-afc5c",
  storageBucket: "gs://carrot-market-afc5c.appspot.com",
  messagingSenderId: "993298189976",
  appId: "1:993298189976:web:40c33cc6d86417ff4c8aed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const storage = getStorage(app);
