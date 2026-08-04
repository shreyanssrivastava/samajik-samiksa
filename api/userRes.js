import { db, FieldValue } from "../lib/fbAdmin.js";

export default async function handler(req, res) {
 
  if (req.method !== "POST" || new URL(req.headers.referer).pathname.split("/")[1] !== "articles") {
    return res.status(405).json({ error: "Unable to process" });
  }

  const { docId, data } = JSON.parse(req.body);

  try {
  
    if (data === "like") {  
      await db.collection("articles").doc(docId).update({
          likes: FieldValue.increment(1)
      });
    } else if (data === "unlike") {
      await db.collection("articles").doc(docId).update({
          likes: FieldValue.increment(-1)
      });        
    } else {
      data.time = new Date();
      await db.collection("articles").doc(docId).update({
          comments: FieldValue.arrayUnion(data)
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
}