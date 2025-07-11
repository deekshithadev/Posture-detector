import cv2
import mediapipe as mp
import numpy as np
import sys
import json

# Debug: Notify script started
print("✅ Pose detector script started", file=sys.stderr)
sys.stderr.flush()

mp_pose = mp.solutions.pose

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180:
        angle = 360 - angle
    return angle

def detect_posture(video_path):
    cap = cv2.VideoCapture(video_path.strip())  # strip() to remove accidental newline/space
    feedback = []

    with mp_pose.Pose(static_image_mode=False) as pose:
        frame_num = 0
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            frame_num += 1

            # ✅ Process every 5th frame
            if frame_num % 5 != 0:
                continue

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)

            if not results.pose_landmarks:
                continue

            landmarks = results.pose_landmarks.landmark

            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                   landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]

            back_angle = calculate_angle(shoulder, hip, knee)
            if back_angle < 150:
                feedback.append({
                    "frame": frame_num,
                    "issue": f"Back angle < 150° ({round(back_angle)}°)"
                })

            if knee[0] > ankle[0]:
                feedback.append({
                    "frame": frame_num,
                    "issue": "Knee ahead of toe"
                })

    cap.release()
    print(json.dumps(feedback))  # ✅ Output JSON to stdout

if __name__ == "__main__":
    detect_posture(sys.argv[1])
    print("✅ Done", file=sys.stderr)
    sys.stderr.flush()
