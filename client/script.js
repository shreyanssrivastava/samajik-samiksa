              /*---- Porting ----*/
  import { auth, db, provider } from "./lib/fbClient.js";
  import {
    signOut,
    updateProfile,
    applyActionCode,
    onAuthStateChanged,
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
    doc, addDoc, setDoc, getDoc, getDocs, orderBy,
    startAfter, limit, query, where, collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
 
  let isUser = false;

  auth.languageCode = "en";
  provider.setCustomParameters({ hl: "en" });


            /*---- page-navigation ----*/
  const home = document.getElementById('home');
  const enote = document.getElementById('enote');
  const article = document.getElementById('article');
  const paper = document.getElementById('paper');
  const about = document.getElementById('about');
  const connect = document.getElementById('connect');

  home.addEventListener('click', () => {
    location.reload();
  });
  enote.addEventListener('click', () => {
    window.location.href = "/enote";
  });
  article.addEventListener('click', () => {
    window.location.href = "/articles";
  });
  paper.addEventListener('click', () => {
    window.location.href = "/cu.html";
  });
  about.addEventListener('click', () => {
    window.location.href = "/cu.html";
  });
  connect.addEventListener('click', () => {
    window.location.href = "/cu.html";
  });

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

               /*---- explore-btn ----*/  
  const expBtn = document.getElementById("explore-btn");
  const secTwo = document.querySelector(".sec-two");
   
  expBtn.addEventListener("click", () => {
      secTwo.scrollIntoView({ behavior: "smooth" });
  });

            /*---- featured-content ----*/
  const featArts = document.getElementById("feat-arts");  
  let swiper = null;
  const swiperOptions = {
      loop: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      grabCursor: true,

      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        strech: 0,
        depth: 80,
        scale: 0.95,
        modifier: 1,       
        slideShadows: false
      },

      speed: 1000,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false
      },
      
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
             
      allowTouchMove: true
  };
  
  async function loadFeats() {
    try {
  
      const q = query(
          collection(db, "articles"),
          where("status", "==", "published"),
          where("featured", "==", true),
          orderBy("publishedAt", "desc")
      );

      const snaps = await getDocs(q);
      
      if (snaps.empty) {
        toast.error("Featured articles not found!");
        return;
      }
     
      snaps.docs.forEach((doc) => {

        const article = doc.data();
        const artBody = article.body.split("<p>")[1].split("</p>")[0];
        const card = document.createElement("div");
        card.className = "feat-art-card swiper-slide";
        card.innerHTML = `
            <div onClick="window.location.href='/articles/${article.slug}'" class="card-content">
              <h2>${article.title}</h2>
              <p class="card-desc">${article.desc} • ${article.minutes} min read</p>
              <p class="card-body">${artBody}</p>
              <em class="card-author">${article.author}</em>
              <img src="/assets/circle_logo.png" alt="circle-logo">
            </div>
        `;
     
        featArts.classList.remove("loading");
        featArts.appendChild(card);        
      });
     
      swiper = new Swiper('.swiper', swiperOptions);      
      swiper.autoplay.stop();
      
      setTimeout(() => swiper.autoplay.start(), 500);
    
    } catch (error) {
        console.log(error);
    }
  }

  loadFeats();



            /*---- latest-content ----*/
  const latArts = document.getElementById("lat-arts");  
  const latSk = document.querySelectorAll(".lat-sk");
  async function loadLatests() {
    try {
  
      const q = query(
          collection(db, "articles"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc"),
          limit(6)
      );

      const snaps = await getDocs(q);
      
      if (snaps.empty) {
        toast.error("Latest articles not found!");
        return;
      }
     
      snaps.docs.forEach((doc) => {

        const article = doc.data();
        const artBody = article.body.split("<p>")[1].split("</p>")[0];
        const card = document.createElement("article");
        card.className = "lat-art-card";
        card.innerHTML = `
            <div onClick="window.location.href='/articles/${article.slug}'" class="card-content">
              <h2>${article.title}</h2>
              <p class="card-desc">${article.desc} • ${article.minutes} min read</p>
              <p class="card-body">${artBody}</p>
              <em class="card-author">${article.author}</em>
              <img src="/assets/circle_logo.png" alt="circle-logo">
            </div>
        `;
     
        latSk.forEach(sk => sk.classList.add("hide"));
        latArts.appendChild(card);        
      });
     
    } catch (error) {
        console.log(error);
    }
  }

  loadLatests();


  
      
  
  
  
  
  
  
  
   
  

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


  document.getElementById("google-btn").addEventListener("click", async () => {
    try {
      toast.promise("Processing...");
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const token = await result.user.getIdToken();
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Login successful");
      // window.location.replace('/');
    } catch (error) {
        console.error(error);
        toast.error(error);
    }
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
