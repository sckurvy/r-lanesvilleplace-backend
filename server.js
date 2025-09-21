import express from "express";
import multer from "multer"; // handles file uploads
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// store uploads in ./uploads folder
const upload = multer({ dest: "uploads/" });

// simple slur filter
const bannedWords = ["nigger", "faggot"]; // expand as needed
function censor(text) {
  let safe = text;
  for (let word of bannedWords) {
    let regex = new RegExp(word, "gi");
    safe = safe.replace(regex, "****");
  }
  return safe;
}

// in-memory posts (later swap to DB)
let posts = [];

// upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  const { name, caption, description } = req.body;

  const post = {
    id: Date.now(),
    name: censor(name || "Anon"),
    caption: censor(caption || ""),
    description: censor(description || ""),
    file: req.file ? `/uploads/${req.file.filename}` : null,
  };

  posts.push(post);
  res.json({ success: true, post });
});

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// get posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
