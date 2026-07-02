import fs from "fs";
import path from "path";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_SAM_PRJ_ID,
      clientEmail: process.env.FB_SAM_CLT_EMAIL,
      privateKey: process.env.FB_SAM_PVT_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  
  function rewrite(folder, file) {
      const dest = path.join(process.cwd(), folder, file));
      const data = fs.readFileSync(filePath);
      res.setHeader("Content-Type", "text/html");
      return res.send(data);
  }
  
  try {
    
    const sessionCookie = req.cookies.session;
    
    if (!sessionCookie) {
        return rewrite("client", "404.html");
    }
    
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    if (decoded.uid !== process.env.SAM_ADMIN_UID) {
        return rewrite("client", "404.html");
    }
    
    return rewrite("admin", "index.html");
  
  } catch (error) {
      console.log(error.message);
      return rewrite("client", "404.html");
  }
}