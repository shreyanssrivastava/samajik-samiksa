import admin from "../lib/fbAdmin.js";

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Unable to process" });
  }
  
  try {
      
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");
   
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    const decoded = await admin.auth().verifyIdToken(token);
    
    if (decoded.uid !== process.env.SAM_ADMIN_UID) {
        return res.status(403).json({ error: "Forbidden" });
    }
    
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

    res.setHeader(
        "Set-Cookie",
        `session=${sessionCookie}; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn / 1000}; Path=/`
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }  
}