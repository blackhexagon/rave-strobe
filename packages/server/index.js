const express = require('express');
const multer = require('multer');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);

// Configure multer for file storage
const upload = multer({ dest: 'uploads/' });

// Create a new WebSocket server instance linked to the server
const wss = new WebSocketServer({ server });

// Broadcast data to all connected clients
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    // You might want to rename the file or do other processing here
    const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
    };

    // Notify all WebSocket clients about the new image
    broadcast(JSON.stringify(fileData));

    res.status(200).json({ message: 'Image uploaded successfully!', fileData });
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start server
server.listen(3000, () => console.log(`Listening on http://localhost:3000/`));