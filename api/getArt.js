import fs from "fs";
import path from "path";
import { db } from "../lib/fbAdmin.js";

export default async function handler(req, res) {

  let data = null;
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.pathname.split("/").pop();
  
  function readFile(folder, file) {
      const dest = path.join(process.cwd(), folder, file);
      return fs.readFileSync(dest, "utf8");
  }

  try {
    
    const snap = await db.collection("articles").where("slug", "==", slug).limit(1).get();

    if (snap.empty) {
        data = readFile("client", "404.html");
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(404).send(data);
    }

    const article = snap.docs[0].data();
    data = readFile("client", "article.html");
    data = data
    .replaceAll("{{TITLE}}", article.title)
    .replaceAll("{{DESCRIPTION}}", article.desc)
    .replaceAll("{{URL}}", url.origin + url.pathname)
    .replaceAll("{{AUTHOR}}", article.author)
    .replaceAll("{{BODY}}", article.body);
    
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(data);  
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
}