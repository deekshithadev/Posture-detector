const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions)); 
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
  console.log("📥 Saved video to:", filePath);

  // Spawn Python process
  const pythonProcess = spawn('python', ['pose_detector.py', filePath]);

  let feedbackData = '';

  // Collect stdout
  pythonProcess.stdout.on('data', (data) => {
    console.log("🐍 Python stdout:", data.toString());
    feedbackData += data.toString();
  });

  // Collect stderr
  pythonProcess.stderr.on('data', (data) => {
    console.error("❌ Python stderr:", data.toString());
  });

  // Process ends
  pythonProcess.on('close', (code) => {
    console.log(`🚦 Python process exited with code: ${code}`);
    if (code !== 0) {
      return res.status(500).json({ error: 'Python script failed' });
    }

    try {
      const feedback = JSON.parse(feedbackData);
      res.json({ feedback });
    } catch (e) {
      console.error("❗ Failed to parse Python output:", e);
      res.status(500).json({ error: 'Failed to parse feedback from Python' });
    }
  });
});

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Posture Detection Backend is Running");
});

// Start server
app.listen(port,  () => {
  console.log(`✅ Backend server running at http://localhost:${port}`);
});
