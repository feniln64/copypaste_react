import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA5TEnJqDGm6-UMVJMNdqLVubwZX_QUByo",
    authDomain: "docopypaste-dfb15.firebaseapp.com",
    databaseURL: "https://docopypaste-dfb15-default-rtdb.firebaseio.com",
    projectId: "docopypaste-dfb15",
    storageBucket: "docopypaste-dfb15.appspot.com",
    messagingSenderId: "1049718037315",
    appId: "1:1049718037315:web:d391882d004050c868edf6",
    measurementId: "G-TJG9DPM0SF"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);