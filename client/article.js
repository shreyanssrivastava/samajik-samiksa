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




const btn = document.getElementById("listen");
const pauseBtn = document.getElementById("pause");
const synth = window.speechSynthesis;

function speakLongText(chunks, paragraphs) {

    function clearHighlight() {
        paragraphs.forEach(p => {
          if (p) p.classList.remove("speaking");
        });
    }

    function speakChunk(index) {
        if (index >= chunks.length) {
          clearHighlight();
          return;
        }
        
        clearHighlight();
        
        const paraIndex = index - 3;

        if (paraIndex >= 0 && paraIndex < paragraphs.length) {
            paragraphs[paraIndex].classList.add("speaking");

            // Optional auto scroll
            paragraphs[paraIndex].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = "en-IN";

        utterance.onend = () => {
            speakChunk(index + 1);
        };

        speechSynthesis.speak(utterance);
    }

    speakChunk(0);
}

btn.addEventListener("click", () => {
    speechSynthesis.cancel();
    const author = document.getElementById("author-name").innerText;
    const title = document.getElementById("art-title").innerText;      
    const para = [...document.querySelectorAll("#art-body p")]    
    .filter(p => p.innerText.trim());

    const paraTexts = para.map(p => p.innerText.trim());

    const chunks = [
        `Welcome to Samajik Samiksha.`,
        `You are listening to an article written by ${author}.`,
        `Today's article is titled "${title}".`,     
        ...paraTexts.slice(0, -1),
        `Thank you for listening to Samajik Samiksha.`
    ];
    
  //  console.log(para);
    speakLongText(chunks, para);  
});

let speak = true;
pauseBtn.onclick = () => {
  //  console.log(speechSynthesis.paused);
    if (speak) {
        synth.pause();
        speak = false;
    } else {
        synth.resume();
        speak = true;
    }
};



/*
const btn = document.getElementById("listen");
const articleText = document.getElementById("art-body").innerText;
let utterance = null;
setTimeout(() => {
  utterance = new SpeechSynthesisUtterance(articleText);

//  utterance.rate = 1;
 // utterance.pitch = 1;
//  utterance.lang = "en-US";
  
}, 5000);

  
btn.addEventListener("click", () => {
  console.log("clicked");
  speechSynthesis.speak(utterance);
});
*/

/*  
  const slug = window.location.pathname.split("/").pop(); 
  const artTitle = document.getElementById("art-title");  
  const artDesc = document.getElementById("art-desc");
  const authorImg = document.getElementById("author-img");
  const authorName = document.getElementById("author-name"); 
  const artBody = document.getElementById("art-body");  
 
  async function show() {
    try {      
      const q = query(collection(db, "articles"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (snap.empty) return toast.error("Article not found");
      const article = snap.docs[0].data();
      artTitle.textContent = article.title;
      artDesc.textContent = article.desc;
      authorImg.src = "/assets/circle_logo.png";
      authorName.textContent = article.author;
      artBody.innerHTML = article.body;
      toast.success("Enjoy reading");
    } catch (err) {
        alert(err);
    }
  }
  
  show();
*/

});
