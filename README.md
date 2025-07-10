# 🧍‍♂️ Posture Detector – Rule-Based Full-Stack App

This is a full-stack web application that detects **bad posture** from a video or webcam using rule-based logic powered by **MediaPipe**, **OpenCV**, and **Node.js**.

🔎 Detects posture issues like:
- ❌ Knee ahead of toe (in squats)
- ❌ Back angle < 150°
- ❌ Slouching while sitting
- ❌ Neck bending > 30°


## 🌐 Live Demo

- **Frontend (React)**: [https://posture-detector-gilt.vercel.app](https://posture-detector-gilt.vercel.app)
- **Backend (Render)**: [https://posture-detector-lwm0.onrender.com](https://posture-detector-lwm0.onrender.com)

---

## 🎥 Demo Video

📽️ [Click here to view the demo](#)  
*(Upload to YouTube, Loom, or Google Drive, and paste the link here)*

---

## 📦 Tech Stack

### Frontend
- React.js (with Hooks)
- Tailwind CSS
- Axios for HTTP requests
- File upload 

### Backend
- Node.js + Express
- Python (MediaPipe, OpenCV)
- Multer for file upload handling
- Spawn to run Python script from Node.js

---

## 📁 Folder Structure

posture-detector/
├── frontend/ # React frontend
│ └── src/
├── backend/ # Node.js backend
│ └── pose_logic.py # Python script using MediaPip

---

## 🚀 Setup Instructions (Local)

### 🔧 Clone Repo

```bash
git clone https://github.com/deekshithadev/posture-detector.git
cd posture-detector

Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
Runs on http://localhost:3000

Backend Setup
Make sure Python 3.10+ is installed.

cd backend
npm install
pip install mediapipe opencv-python numpy
node server.js
Backend runs on http://localhost:5000

Posture Detection Logic
✅ Rule-based detection via Python:

Squat Mode:

knee_x > toe_x → “Knee ahead of toe”

back_angle < 150° → “Back angle too low”

Desk Sitting:

neck angle > 30° → “Neck bend”

spine curve != straight → “Slouching”

Author 
Deekshitha VN
CONTACT  Email:deekshitha2612@gmail.com LikedIn:https://www.linkedin.com/in/deekshitha-vn/
