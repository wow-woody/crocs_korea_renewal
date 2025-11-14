// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
<<<<<<< HEAD
// const firebaseConfig = {
//     apiKey: 'AIzaSyC4NSPfbGAiQccEXSlwXsLSBZV6gd0mrzA',
//     authDomain: 'ezen-test-9bc64.firebaseapp.com',
//     projectId: 'ezen-test-9bc64',
//     storageBucket: 'ezen-test-9bc64.firebasestorage.app',
//     // storageBucket: 'ezen-test-9bc64.appspot.com',
//     messagingSenderId: '849029273895',
//     appId: '1:849029273895:web:1b7b6d4469dea57df1f102',
// };

const firebaseConfig = {
    apiKey: 'AIzaSyC4NSPfbGAiQccEXSlwXsLSBZV6gd0mrzA',
    authDomain: 'ezen-test-9bc64.firebaseapp.com',
    projectId: 'ezen-test-9bc64',
    storageBucket: 'ezen-test-9bc64.firebasestorage.app',
    messagingSenderId: '849029273895',
    appId: '1:849029273895:web:1b7b6d4469dea57df1f102',
=======
const firebaseConfig = {
    apiKey: 'AIzaSyDVZl8jVtpYocsHB8wr5ep-6Z7smuj0dYc',
    authDomain: 'crocs-korea-renewal.firebaseapp.com',
    projectId: 'crocs-korea-renewal',
    storageBucket: 'crocs-korea-renewal.firebasestorage.app',
    messagingSenderId: '730202810243',
    appId: '1:730202810243:web:e9856329d6b6cc3fed78b6',
>>>>>>> 7e8c2c77746530933c16fbb40c876986979575d2
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
