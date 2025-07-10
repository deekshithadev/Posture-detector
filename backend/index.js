const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}.mp4`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// Upload route with Python script integration
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  console.log("Saved to:", filePath);

  // Spawn Python process
  const pythonProcess = spawn('python', ['pose_detector.py', filePath]);

  let feedbackData = '';

  pythonProcess.stdout.on('data', (data) => {
    feedbackData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Python script failed' });
    }

    try {
      const feedback = JSON.parse(feedbackData);
      res.json({ feedback });
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse feedback from Python' });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Posture Detection Backend is Running 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
});
