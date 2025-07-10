import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setFeedback([]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error('Upload failed:', error);
      alert("Failed to upload or process the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">🧍‍♂️ Posture Detection App</h1>

      <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Processing...' : 'Upload & Analyze'}
      </button>

      {feedback.length > 0 && (
        <div className="mt-8 w-full max-w-xl bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">⚠️ Posture Issues Detected:</h2>
          <ul className="list-disc list-inside space-y-1">
            {feedback.map((item, index) => (
              <li key={index}>
                <strong>Frame {item.frame}:</strong> {item.issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.length === 0 && !loading && videoFile && (
        <div className="mt-6 text-green-600 font-semibold">
          ✅ No posture issues detected!
        </div>
      )}
    </div>
  );
}

export default App;
