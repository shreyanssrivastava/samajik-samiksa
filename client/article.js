               /*---- Porting ----*/ 
  import { auth, db } from "./lib/fbClient.js";
  import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
 
  import {
    doc, addDoc, setDoc, getDoc, getDocs,
    query, where, collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
   
  let lastScroll = 0;

  const navbar = document.getElementById('my-navbar')
  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (current > lastScroll) {
        navbar.classList.add("hide"); // down
    } else {
        navbar.classList.remove("hide"); // up
    }

    lastScroll = current;
  });











  const listenBtn = document.getElementById("listen-btn");
  const lisPlay = document.getElementById("listen-play");
 
  const playBox = document.getElementById("player-box");
  const reset = document.getElementById("reset");
  const minus = document.getElementById("minus");
  const prev = document.getElementById("prev");
  const pause = document.getElementById("pause");
  const next = document.getElementById("next");
  const plus = document.getElementById("plus");
  const close = document.getElementById("close");

  const author = document.getElementById("author-name").innerText;
  const title = document.getElementById("art-title").innerText;      
  const para = [...document.querySelectorAll("#art-body p")]    
  .filter(p => p.innerText.trim()).slice(0, -1);
  const paraTexts = para.map(p => p.innerText.trim());

  setTimeout(() => console.log(para), 5000);

  const player = {

    currentIndex: 0,
    status: "idle",
    chunks: [
        `Welcome to Samajik Samiksha.`,
        `You are listening to an article written by ${author}.`,
        `Today's article is titled "${title}".`,     
        ...paraTexts,
        `Thank you for listening to Samajik Samiksha.`
    ],
    paragraphs: para,

    clearHighlight() {
        this.paragraphs.forEach(p => {
            if (p) p.classList.remove("speaking");
        });
    },

    speakChunk(index) {
  
        this.currentIndex = index;
        if (index >= this.chunks.length || this.status === "paused") {
          this.clearHighlight();
          return;
        }
        
        this.clearHighlight();
        
        const paraIndex = index - 3;

        if (paraIndex >= 0 && paraIndex < this.paragraphs.length) {
            this.paragraphs[paraIndex].classList.add("speaking");

            // Optional auto scroll
            this.paragraphs[paraIndex].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        const utterance = new SpeechSynthesisUtterance(this.chunks[index]);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = "en-IN";

        utterance.onend = () => {
          if (this.status === "played" || this.status === "resumed") {
            this.speakChunk(index + 1);
          }
        };
        
        speechSynthesis.speak(utterance);
    },
    
    play() {
        speechSynthesis.cancel();     
        this.status = "played";
        this.speakChunk(0);
    },
    
    pause() { 
        this.status = "paused";
        this.clearHighlight();
        speechSynthesis.cancel();
    },

    resume() {
        this.status = "resumed";
        this.speakChunk(this.currentIndex);
    },
    
    stop() {
        this.status = "idle";
        this.clearHighlight();
        speechSynthesis.cancel();
    }   
  };

  listenBtn.addEventListener("click", function () {
      this.disabled = true;
      lisPlay.classList.remove("fa-regular", "fa-circle-play");
      lisPlay.classList.add("fa-solid", "fa-spinner", "fa-spin-pulse");   
      setTimeout(() => {
        this.classList.add("active");
        if (player.status === "idle") player.play();
        lisPlay.classList.remove("fa-spinner", "fa-spin-pulse");
        lisPlay.classList.add("fa-compact-disc", "fa-spin");
        playBox.classList.add("show");
      }, 5000);
  });

  pause.addEventListener("click", function () {
      if (player.status === "played" || player.status === "resumed") {
          player.pause();
          this.classList.replace("fa-pause", "fa-play");
      } else {
          player.resume();
          this.classList.replace("fa-play", "fa-pause");
      }
  });



  prev.addEventListener("click", function () {
      const prevIndex = Math.max(0, player.currentIndex - 1);
      speechSynthesis.cancel();
      player.speakChunk(prevIndex);
  });
  
  next.addEventListener("click", function () {
      const nextIndex = Math.min(player.chunks.length - 1, player.currentIndex + 1);
      speechSynthesis.cancel();
      player.speakChunk(nextIndex);
  });
  
  reset.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      player.play();
  });
  
  close.addEventListener("click", function () {
        player.stop();
        playBox.classList.remove("show"); 
        lisPlay.classList.remove("fa-solid", "fa-compact-disc", "fa-spin");
        lisPlay.classList.add("fa-regular", "fa-circle-play");       
        listenBtn.classList.remove("active");
        listenBtn.disabled = false;        
  });




});
