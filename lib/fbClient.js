import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const FB_API_KEY = atob("QUl6YVN5RGk2TDQ4ZmQ5b0hXWDRTT3FXbjZSejBxZ2dXRmQxYks0");
const firebaseConfig = {
    apiKey: FB_API_KEY,
    authDomain: "samajik-samiksa.firebaseapp.com",
    projectId: "samajik-samiksa",
    storageBucket: "samajik-samiksa.firebasestorage.app",
    messagingSenderId: "708185280377",
    appId: "1:708185280377:web:66beafb863ffba4e0829a8",
    measurementId: "G-RXV82S704G"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();