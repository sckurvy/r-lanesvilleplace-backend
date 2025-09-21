import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Make sure uploads folder exists
const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer setup
const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/", "video/"];
    if (file.mimetype.startsWith("text/") || allowed.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// Slur filter (regex for leetspeak)
const bannedPatterns = [
  /\b(n[\W_]*[i1!|][\W_]*[gq9]{2,}[\W_]*[e3][\W_]*[r]+)\b/gi,
  /\b(n[\W_]*[i1!|][\W_]*[gq9]+[\W_]*[a4]+)\b/gi,
  /\b(f[\W_]*[a4@][\W_]*[gq9]{1,2}[\W_]*[o0]*[\W_]*[t7]+)\b/gi,
  /\b(b[\W_]*[e3][\W_]*[a4][\W_]*[n][\W_]*[e3][\W_]*[r]+)\b/gi,
  /\b(s[\W_]*[p][\W_]*[i1!|][\W_]*[c]+)\b/gi,
  /\b(c[\W_]*[h]+[\W_]*[i1!|][\W_]*[n][\W_]*[k]+)\b/gi,
  /\b(g[\W_]*[o0]{2,}[\W_]*[k]+)\b/gi,
  /\b(k[\W_]*[i1!|][\W_]*[k][\W_]*[e3]+)\b/gi,
  /\b(r[\W_]*[a4][\W_]*[gq9]+[\W_]*h[\W_]*[e3][\W_]*[a4][\W_]*[d]+)\b/gi,
  /\b(s[\W_]*[a4][\W_]*[n][\W_]*d[\W_]*n[\W_]*[i1!|][\W_]*[gq9]{2,}[\W_]*[e3][\W_]*[r]+)\b/gi,
];

function censor(text) {
  let safe = text;
  for (let pattern of bannedPatterns) {
    safe = safe.replace(pattern, "****");
  }
  return safe;
}

// In-memory posts
let posts = [];

// Upload endpoint
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

// Serve uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// Get posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
