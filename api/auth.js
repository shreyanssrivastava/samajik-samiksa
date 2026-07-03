import admin from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  try {
      
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");
   
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (decodedToken.uid !== process.env.SAM_ADMIN_UID) {
        return res.status(403).json({ error: `Forbidden. UID: ${decodedToken.uid}`, });
    }
    
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    res.setHeader(
        "Set-Cookie",
        `session=${sessionCookie}; HttpOnly${secure}; SameSite=Strict; Max-Age=${expiresIn / 1000}; Path=/`
    );
    
    res.status(200).json({ success: true });
    
  } catch (error) {
      res.status(500).json({ error: error.message });
  }  
}