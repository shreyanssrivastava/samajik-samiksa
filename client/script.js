              /*---- Porting ----*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import {
    getAuth,
    signOut,
    updateProfile,
    applyActionCode,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    confirmPasswordReset,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithCredential,
    sendEmailVerification,
    EmailAuthProvider, 
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    updatePassword,
    deleteUser,
    signInWithPhoneNumber,
    RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
  import {
    getFirestore,
    doc, addDoc, setDoc, getDoc, getDocs,
    query, where,
    collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  let isUser = false;
  
  const firebaseConfig = {
      apiKey: "AIzaSyDi6L48fd9oHWX4SOqWn6Rz0qggWFd1bK4",
      authDomain: "samajik-samiksa.firebaseapp.com",
      projectId: "samajik-samiksa",
      storageBucket: "samajik-samiksa.firebasestorage.app",
      messagingSenderId: "708185280377",
      appId: "1:708185280377:web:66beafb863ffba4e0829a8",
      measurementId: "G-RXV82S704G"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider()  

  auth.languageCode = "en";
  provider.setCustomParameters({ hl: "en" });



            /*---- create-toast ----*/
  let snack = null;
  const base = {
    className: "load",
    duration: -1,
    close: false,
    gravity: "top",
    position: "center",
    offset: {
        y: 75
    },
    escapeMarkup: false,
    stopOnFocus: true
  };

  function serveToast(latest) {
    if (snack) snack.hideToast();
    snack = Toastify({
      ...base,
      ...latest
    }).showToast();

    return snack;
  }

  const toast = {
    success: (msg) => serveToast({
      text: `
        <div class="toast-content">
          <i class="fa-regular fa-circle-check"></i>
          <span>${msg}</span>
        </div>
      `,
      duration: 5000,
      className: "success"
    }),
    
    error: (msg, changes) => serveToast({
      text: `
        <div class="toast-content">
          <i class="fa-regular fa-circle-xmark"></i>
          <span>${msg}</span>
        </div>
      `,
      duration: 5000,
      className: "error",
      ...changes
    }),
    
    warn: (msg, changes) => serveToast({
      text: `
        <div class="toast-content">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>${msg}</span>
        </div>
      `,
      className: "warn",
      ...changes
    }),

    promise: (msg) => serveToast({
      text: `
        <div class="toast-content">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span>${msg}</span>
        </div>
      `,
    })
  };

                /*---- Sign In/Up ----*/
  const login = document.getElementById('login');
  const account = document.getElementById('acc-box-bg');
  
  login.addEventListener('click', () => {
      account.classList.toggle('show');
  });
  
  const accBox = document.getElementById('acc-box');
  const pfBox = document.getElementById('profile-box');
  const frontBox = document.getElementById('front-box');
  const toggleBtn = document.getElementById('toggle-form');
  const logBox = document.getElementById('login-box');
/* 
  const name = document.getElementById('pro-name');
  const email = document.getElementById('pro-email');
  const image = document.querySelectorAll('#dp, #pc-dp, #pf-pic');
 */ 
  const pfName = document.getElementById('inp_pf_name');
  const pfEmail = document.getElementById('inp_pf_email');
  const pfEmailCheck = document.getElementById('pf-email-check');


  document.getElementById("google-btn").addEventListener("click", (e) => {
      toast.promise("Processing...");
      signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        toast.success("Login successful");
        window.location.replace('/');
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  });

  const checkUser = onAuthStateChanged(auth, (user) => {
     if (user) {
        isUser = true;        
        console.log(JSON.stringify(user));
        accBox.style.display = 'none';
        pfBox.style.display = 'grid';
    //    login.style.display = 'none';
  
    //    name.textContent = user.displayName;                                                
    //    email.textContent = user.email;
     
        pfName.value = user.displayName;                                                            
        pfEmail.value = user.email;

    //    image.forEach((img) => {
    //      img.src = user.photoURL
     //     img.onerror = function() {
      //        this.src = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
     //     };
    //    });
            
     } else {
         isUser = false;
         console.log('No user logged in!!');
         pfBox.style.display = 'none';
         accBox.style.display = 'flex';
     }
     
     checkUser();
  });
  
  
    const logOutBtn = document.getElementById('logout-btn');    
    logOutBtn.addEventListener("click", () => {
      signOut(auth)
      .then(() => {
          toast.success("Logging out...")
          location.replace('/');
      })
      .catch((error) => {
          console.log(error);
          toast.error(error);
      });
    });



});