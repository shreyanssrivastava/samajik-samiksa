               /*---- Porting ----*/ 
  import { auth, db } from "./lib/fbClient.js";
  import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
 
  import {
    doc, addDoc, setDoc, getDoc, getDocs, orderBy,
    startAfter, limit, query, where, collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  let isUser = false;

  const checkUser = onAuthStateChanged(auth, (user) => {
     if (user) {
        isUser = true;        
        console.log(JSON.stringify(user));
     } else {
         isUser = false;
         console.log('No user logged in!!');
     }
     
     checkUser();
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
  
//  toast.promise("Processing...");

  let lastDoc = null;
  const skWrap = document.getElementById("sk-wrap");
  const pgWrap = document.getElementById("wrapper");
  const articles = document.getElementById("articles");
  const exploreBtn = document.getElementById("explore-btn");
  const expBtnIcon = document.getElementById("exp-btn-icon");
  const endText = document.getElementById("end-text");
 
  async function loadArts() {
    try {
    
      let q;
      if (lastDoc) {
          q = query(
            collection(db, "articles"),
            where("status", "==", "published"),
            orderBy("publishedAt", "desc"),
            startAfter(lastDoc),
            limit(10)
          );
          expBtnIcon.classList.remove("fa-arrow-right-long");
          expBtnIcon.classList.add("fa-circle-notch", "fa-spin");       
      } else {
          q = query(
            collection(db, "articles"),
            where("status", "==", "published"),
            orderBy("publishedAt", "desc"),
            limit(10)
          );
      }
      
      const snaps = await getDocs(q);
      
      if (snaps.empty) {
        exploreBtn.classList.add("hide");
        endText.classList.remove("hide");
        return;
      }
     
      lastDoc = snaps.docs[snaps.docs.length - 1];
      
      snaps.docs.forEach((doc) => {

        const article = doc.data();
        const artBody = article.body.split("<p>")[1].split("</p>")[0];
        const card = document.createElement("article");
        card.className = "article-card osa";
        card.innerHTML = `
            <div onClick="window.location.href='/articles/${article.slug}'" class="card-content">
              <h2>${article.title}</h2>
              <p class="card-desc">${article.desc} | ${article.words}</p>
              <p class="card-body">${artBody}</p>
              <em class="card-author">${article.author}</em>
              <img src="/assets/circle_logo.png" alt="circle-logo">
            </div>
        `;

        skWrap.classList.add("hide");
        pgWrap.classList.remove("hide");
        articles.appendChild(card);
        fadeIn();
        expBtnIcon.classList.remove("fa-circle-notch", "fa-spin");
        expBtnIcon.classList.add("fa-arrow-right-long");
          
      });
         
    } catch (err) {
        alert(err);
    }
  }

  loadArts();
  exploreBtn.addEventListener("click", function () {
    this.disabled = true;
    if (lastDoc) loadArts();
  });  
  
             /*-- fade-in animation --*/
  function fadeIn() {
    const objects = document.querySelectorAll('.osa:not(.animated)');
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    objects.forEach(object => {
        object.classList.add('animate');    
        observer.observe(object);
        object.addEventListener("transitionend", function () {
          if (!this.classList.contains("explore")) {
            this.classList.add("animated");
          } else {
              this.disabled = false;
          }
        }, { once: true });
    });    
  }
  
 
 
});
