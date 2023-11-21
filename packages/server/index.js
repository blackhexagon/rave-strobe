const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();
const server = http.createServer(app);

// Enable All CORS Requests for REST API
app.use(cors())

const uploadsDir = "uploads/"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir); // Set the destination directory for uploaded files
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
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
app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        // Respond with a JSON object that includes the filename as saved on the server
        broadcast(JSON.stringify({photo: req.file.filename}));
        res.status(200).json({
            message: 'File uploaded successfully.',
            filename: req.file.filename // The filename on the server
        });
    } else {
        res.status(400).json({ message: 'No file was uploaded.' });
    }
    // Notify all WebSocket clients about the new image
});

app.get('/photo/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, uploadsDir, filename);
    if (fs.existsSync(filePath)) {
        res.type('image/jpeg'); // Or determine the type dynamically if you store different types
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 Not Found');
    }
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start server
server.listen(3000, () => console.log(`Listening on http://localhost:3000/`));