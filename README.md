# FactShield AI

## About the Project

FactShield AI is a web-based project developed to detect fake news using Machine Learning. Users can enter a news headline or article, and the system predicts whether it is real or fake along with the confidence score.

The project also includes the basic user interface for Fake Image Detection and Deepfake Detection, which can be extended in future versions.

---

## Features

- Fake News Detection using Machine Learning
- Prediction confidence score
- Fast response through Flask API
- Simple and responsive user interface
- Separate pages for Fake News, Fake Image and Deepfake Detection

---

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask

### Machine Learning
- Scikit-learn
- TF-IDF Vectorizer
- Logistic Regression

---

## Project Structure

```
FactShield-AI
│
├── backend
├── css
├── js
├── assets
├── dataset
├── index.html
├── news.html
├── image.html
├── deepfake.html
└── README.md
```

---

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Debidatta-Nayak/FactShield-AI.git
```

### 2. Go to the backend folder

```bash
cd backend
```

### 3. Install the required packages

```bash
pip install -r requirement.txt
```

### 4. Run the Flask server

```bash
python app.py
```

The backend will start on:

```
http://127.0.0.1:5001
```

### 5. Open the frontend

Open `index.html` using Live Server in VS Code.

---

## Future Improvements

- Fake Image Detection model
- Deepfake Detection model
- User authentication with database
- Dashboard for prediction history
- Better model accuracy

---

## Author

**Debidatta Nayak**

B.Tech Student

---

## License

This project is developed for learning and educational purposes.