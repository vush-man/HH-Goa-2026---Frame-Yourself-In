import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

// In-memory store for generated OG share graphics (ID -> { buffer, createdAt, contentType })
interface ImageRecord {
  buffer: Buffer;
  contentType: string;
  createdAt: number;
}

const ogImageStore = new Map<string, ImageRecord>();

// Clean up images older than 24 hours every hour
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000;
  for (const [id, record] of ogImageStore.entries()) {
    if (now - record.createdAt > maxAge) {
      ogImageStore.delete(id);
    }
  }
}, 60 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for base64 image uploads
  app.use(express.json({ limit: "15mb" }));

  // API 1: Upload generated graphic for OG sharing
  app.post("/api/upload-og", (req, res) => {
    try {
      const { imageBase64, format, name } = req.body;
      if (!imageBase64 || typeof imageBase64 !== "string") {
        return res.status(400).json({ error: "Missing imageBase64 parameter" });
      }

      // Remove data URL header if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const id = crypto.randomBytes(8).toString("hex");
      ogImageStore.set(id, {
        buffer,
        contentType: "image/png",
        createdAt: Date.now(),
      });

      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
      const shareUrl = `${appUrl}/cards/${id}`;
      const ogImageUrl = `${appUrl}/api/og-image/${id}`;

      return res.json({
        id,
        shareUrl,
        ogImageUrl,
      });
    } catch (err: any) {
      console.error("Error storing OG image:", err);
      return res.status(500).json({ error: "Failed to process image upload" });
    }
  });

  // API 2: Serve binary image for Twitter / Open Graph crawler
  app.get("/api/og-image/:id", (req, res) => {
    const { id } = req.params;
    const record = ogImageStore.get(id);

    if (!record) {
      // Fallback placeholder image or 404
      return res.status(404).send("Image not found or expired");
    }

    res.setHeader("Content-Type", record.contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(record.buffer);
  });

  // Route 3: Public Card Share Page with Twitter / Open Graph tags for X bot crawler
  app.get("/cards/:id", (req, res) => {
    const { id } = req.params;
    const record = ogImageStore.get(id);
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const ogImageUrl = `${appUrl}/api/og-image/${id}`;

    if (!record) {
      // If expired, redirect to home
      return res.redirect("/");
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HH Goa 2026 — Frame Yourself In</title>
  <meta name="description" content="Check out my official HH Goa 2026 Builder Graphic! #FrameInGoa">
  
  <!-- Open Graph / Facebook / LinkedIn / X -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${appUrl}/cards/${id}">
  <meta property="og:title" content="HH Goa 2026 — Frame Yourself In">
  <meta property="og:description" content="I framed myself in for Hacker House Goa 2026! Generate yours now. #FrameInGoa">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@247pmstudio">
  <meta name="twitter:title" content="HH Goa 2026 — Frame Yourself In">
  <meta name="twitter:description" content="I framed myself in for Hacker House Goa 2026! Generate yours now. #FrameInGoa">
  <meta name="twitter:image" content="${ogImageUrl}">
  
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #005C31;
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 24px;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid #FFE600;
      border-radius: 16px;
      margin: 16px;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      border: 2px solid #FF007A;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: #FFE600;
      color: #000;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="color: #FFE600; margin-top: 0;">HH GOA 2026</h1>
    <p>Frame Yourself In for Hacker House Goa!</p>
    <img src="${ogImageUrl}" alt="HH Goa 2026 Graphic">
    <div>
      <a href="/" class="btn">Create Your Own Frame →</a>
    </div>
  </div>
</body>
</html>`;

    return res.send(html);
  });

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
