const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sharp = require("sharp");
const { WebSocketServer } = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");
const app = express();
const server = http.createServer(app);

// Enable All CORS Requests for REST API
app.use(cors());
// Add this line to parse JSON bodies
app.use(express.json());

const uploadsDir = "uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialize the multer middleware with the storage engine
const upload = multer({ storage: storage });

// Create a new WebSocket server instance linked to the server
const wss = new WebSocketServer({ server });

// Broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

// Handle image uploads
app.post("/upload", upload.single("photo"), async (req, res) => {
  if (req.file) {
    const imagePath = req.file.path;
    const buffer = await sharp(imagePath)
      .resize({
        width: 1200,
        height: 900,
        fit: sharp.fit.inside,
      })
      .jpeg({ quality: 50 })
      .withMetadata()
      .rotate()
      .toBuffer();
    await sharp(buffer).toFile(imagePath);

    // Respond with a JSON object that includes the filename as saved on the server
    broadcast(JSON.stringify({ photo: req.file.filename }));
    res.status(200).json({
      message: "File uploaded successfully.",
      filename: req.file.filename, // The filename on the server
    });
  } else {
    res.status(400).json({ message: "No file was uploaded." });
  }
  // Notify all WebSocket clients about the new image
});

app.get("/photo/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    res.type("image/jpeg"); // Or determine the type dynamically if you store different types
    res.sendFile(filePath);
  } else {
    res.status(404).send("404 Not Found");
  }
});

app.post("/settings", (req, res) => {
  broadcast(JSON.stringify(req.body));
  res.status(200).json({ message: "OK" });
});

// Serve static files from 'public' directory
app.use(express.static("public"));

// Start server
const port = process.env.PORT_SERVER || 3000;
server.listen(port, () =>
  console.log(`Listening on http://localhost:${port}/`),
);
