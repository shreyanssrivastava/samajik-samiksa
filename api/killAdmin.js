import admin from "../lib/fbAdmin.js";

export default async function handler(req, res) {  
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Unable to process" });
  }
  
  try {
  
    const sessionCookie = req.cookies.session;  
   
    if (!sessionCookie) return res.status(401).json({ error: "Unauthorized" });   
   
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);    
   
    if (decoded.uid !== process.env.SAM_ADMIN_UID) {
        return res.status(403).json({ error: "Forbidden" });
    }
    
    await admin.auth().revokeRefreshTokens(decoded.uid);
  
    res.setHeader(
        "Set-Cookie",
        `session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
    );
        
    res.status(200).json({ success: true });  
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }  
}