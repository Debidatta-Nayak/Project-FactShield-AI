# 🛡️ FactShield AI

FactShield AI is an AI-powered media verification platform designed to help users analyze news content and identify potentially fake or misleading information.

The project combines a modern web interface with Machine Learning, Natural Language Processing, Flask APIs, and MySQL-based authentication.

---

## 🚀 Features

### 📰 Fake News Detection
- Analyze news headlines and articles.
- NLP-based text preprocessing.
- TF-IDF text vectorization.
- Logistic Regression based classification.
- Returns prediction results through a Flask REST API.

### 🔐 User Authentication
- User registration and login.
- Password-based authentication.
- Flask session management.
- MySQL database integration.
- Protected user pages.
- Logout functionality.

### 🖼️ Media Verification
- Dedicated image verification interface.
- Deepfake detection interface prepared for future AI model integration.

### 🎨 Modern UI
- Responsive HTML/CSS interface.
- Interactive JavaScript functionality.
- Responsive navigation.
- User profile section.
- Clean and modern dashboard-style design.

---

## 🧠 Machine Learning Pipeline

The Fake News Detection module follows this pipeline:

```text
News Article
     ↓
Text Preprocessing
     ↓
Stopword Removal
     ↓
Stemming
     ↓
TF-IDF Vectorization
     ↓
Logistic Regression
     ↓
Prediction
     ↓
Fake / Real Result
