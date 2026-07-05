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
  
  const artTitle = document.getElementById("art-title");  
  const artDesc = document.getElementById("art-desc");
  const authorImg = document.getElementById("author-img");
  const authorName = document.getElementById("author-name"); 
  const artBody = document.getElementById("art-body");  
  async function show() {
    try {
      const item = await getDoc(doc(db, "articles", "issue-001"));
      const article = await item.data();
      artTitle.textContent = article.d;
      artDesc.textContent = article.c;
      authorImg.src = "/assets/circle_logo.png";
      authorName.textContent = article.author;
      artBody.innerHTML = article.e;

    } catch (err) {
        alert(err);
    }
  }
  
  show();
  

});