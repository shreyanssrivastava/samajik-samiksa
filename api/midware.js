import fs from "fs";
import path from "path";
import admin from "../lib/fbAdmin.js";

export default async function handler(req, res) {
  
  function rewrite(folder, file, code = 400) {
      const dest = path.join(process.cwd(), folder, file);
      const data = fs.readFileSync(dest);
      res.setHeader("Content-Type", "text/html");
      return res.status(code).send(data);
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
    
    return rewrite("admin", "index.html", 200);
  } catch (error) {
      console.log(error.message);
      return rewrite("client", "404.html");
  }
}
