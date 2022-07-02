import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfW-6HgdZ2R2oFOWsduqUxWb1Yl8-oUy0",
    authDomain: "reddit-clone-234e1.firebaseapp.com",
    projectId: "reddit-clone-234e1",
    storageBucket: "reddit-clone-234e1.appspot.com",
    messagingSenderId: "631698074210",
    appId: "1:631698074210:web:281c6ee317328798c43f3b"
};

const backend = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth();

// Firebase Firestore (Posts)
export const db = getFirestore();
export const posts = collection(db, "posts");

// Firebase Cloud Storage (Images and Videos)
export const storage = getStorage();

export default backend;
