import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "admin", "index.html");

    const html = fs.readFileSync(filePath, "utf8");

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}
