import { db } from "../lib/fbAdmin.js";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Unable to process" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {

    const artSnap = await db
    .collection("articles")
    .where("status", "==", "scheduled")
    .where("publishAt", "<=", new Date())
    .where("emailSent", "==", false)
    .limit(1).get();
  
    if (artSnap.empty) return res.status(200).send("Nothing to publish.");

    const article = artSnap.docs[0];
    const issue = article.data();   

    await article.ref.update({
      status: "published",
      publishedAt: new Date()
    });
   
    const userSnap = await db.collection("users").get();
    const emails = userSnap.docs.map(doc => doc.id).join(", ");

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TL_ID + "1",
        user_id: process.env.EMAILJS_PBL_KEY_SS1,
        accessToken: process.env.EMAILJS_PRV_KEY_SS1,
        template_params: {
          title: issue.title,
          desc: issue.desc,
          author: issue.author,
          body: issue.body,
          emails: emails
        },
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email sending failed: ${errorText}`);
    }

    await article.ref.update({ emailSent: true });
  
    res.status(200).json({ success: true });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}