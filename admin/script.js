               /*---- Porting ----*/ 
  import { auth, db } from "../lib/fbClient.js";
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
  
  const logOutBtn = document.getElementById('logout');    
  logOutBtn.addEventListener("click", async () => {
    try {
      toast.promise("Processing...");
      const res = await fetch("/api/killAdmin", { method: "POST" });
      if (res.ok) {
        await signOut(auth);
        toast.success("Logging out...")
        location.replace('/');
      } else {
          toast.error("Something went wrong");
      }
    } catch (error) {
        console.log(error);
        toast.error(error);
    }
  });
  
  let content = null;
  const docxInp = document.getElementById("docx-file");
  const upBtn = document.getElementById("upload-docx");
  const slugInp = document.getElementById("inp_slug");  
  const publishBtn = document.getElementById("publish-btn");
  
  upBtn.addEventListener("click", () => {
    docxInp.click();
  });
  
  docxInp.addEventListener("change", () => {
    toast.promise("Processing...");
    const file = docxInp.files[0];
    if (!file) {
      toast.error("File not found");
      return;
    }
    
    const reader = new FileReader();

    reader.onload = async function(e) {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement(async function(image) {
                const base64 = await image.read("base64");
                const formData = new FormData();
                formData.append("key", "d8e4ccd142ddf84767dac0474af959ea"); // Replace with your Imgbb API Key
                formData.append("image", base64);
              try {
                const response = await fetch("https://api.imgbb.com/1/upload", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();                  
                return { src: data.data.url };
              } catch (err) {
                  console.error(err);
                  toast.error(err);
              }
            })
          }
        );

        content = result.value;
        toast.success("Successfully uploaded");
      
      } catch (err) {
          console.error(err);
          toast.error(err);
      }     
    }
    
    reader.readAsArrayBuffer(file);    
  });
  
  slugInp.addEventListener("input", function () {
    this.value = this.value.toLowerCase().replace(/\s+/g, "-");
  });
  
  publishBtn.addEventListener("click", () => {
    if (!content || !slugInp.value) {
      toast.error("Something went wrong");
      return;
    }
    toast.promise("Processing...");
    publishContent();
  });
  
  async function publishContent() {
  
    try {
    
      const parser = new DOMParser();
      const data = parser.parseFromString(content, "text/html");

      const paragraphs = [...data.querySelectorAll("p")];

   //   const samiksa = paragraphs[0]?.textContent.trim();
   //   const scrutiny = paragraphs[1]?.textContent.trim();
      const desc = paragraphs[2]?.textContent.trim();
      const title = paragraphs[3]?.textContent.trim();
      const lastP = paragraphs.at(-1)?.textContent.trim();
      
      paragraphs.slice(0, 4).forEach(p => p.remove());

      const author = lastP.slice(2).trim();      
      const bodyHTML = data.body.innerHTML;

      const docName = "issue-" + desc.match(/\d+/)[0].padStart(3, "0");      
      
      await setDoc(doc(db, "articles", docName), {
        slug: slugInp.value,
        title: title,
        desc: desc,
        author: author,
        body: bodyHTML
      });
      
      toast.success("Successfully published");
  
  
    } catch (err) {
        console.log(err);
        toast.error(err);
    }
  
  }


/*
                ---- Sign In/Up ----
                
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
 
  const name = document.getElementById('pro-name');
  const email = document.getElementById('pro-email');
  const image = document.querySelectorAll('#dp, #pc-dp, #pf-pic');

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
*/


});
