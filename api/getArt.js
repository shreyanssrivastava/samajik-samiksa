import fs from "fs";
import path from "path";
import { db } from "../lib/fbAdmin.js";

export default async function handler(req, res) {

  let data = null;
  const url = new URL(req.url, `https://${req.headers.host}`);
  
  if (url.pathname.split("/")[1] === "api") return res.status(405).json({ error: "Unable to process" });
  
  const slug = url.pathname.split("/").pop();
  
  function readFile(folder, file) {
      const dest = path.join(process.cwd(), folder, file);
      return fs.readFileSync(dest, "utf8");
  }

  try {
  
    let snap = null;
  
    if (url.pathname.split("/")[1] === "articles") {
      snap = await db
      .collection("articles")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1).get();
    } else {
        snap = await db
        .collection("articles")
        .where("slug", "==", slug)
        .where("status", "==", "undefined")        
        .limit(1).get();
    }

    if (snap.empty) {
        data = readFile("client", "404.html");
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(404).send(data);
    }

    const article = snap.docs[0].data();
    const avatar = article.avatar === "editor" ? "https://i.ibb.co/jZ3KPMTh/samiksa-editor.jpg" : "/assets/circle_logo.png";
    data = readFile("client", "article.html");
    data = data
    .replaceAll("{{TITLE}}", article.title)
    .replaceAll("{{DESCRIPTION}}", article.desc)
    .replaceAll("{{WORDS}}", article.words)
    .replaceAll("{{URL}}", url.origin + url.pathname)
    .replaceAll("{{AUTHOR}}", article.author)
    .replaceAll("{{AVATAR}}", avatar)  
    .replaceAll("{{BODY}}", article.body)
    .replaceAll("{{LIKES}}", article.likes)
    .replaceAll("{{COMMENTS}}", JSON.stringify(article.comments));
    
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(data);  
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
}
