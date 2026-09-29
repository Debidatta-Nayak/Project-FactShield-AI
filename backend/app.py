# Flask se API banane ke liye required modules import kar rahe hain
from flask import Flask, request, jsonify

# Different frontend se request allow karne ke liye
from flask_cors import CORS
import os
from dotenv import load_dotenv
from auth import auth_bp

# Saved model (.pkl) load karne ke liye
import pickle

# Text cleaning ke liye Regular Expression
import re

# Time calculate karne ke liye
import time

# NLTK library
import nltk

# English stopwords (is, the, a, an...) remove karne ke liye
from nltk.corpus import stopwords

# Words ko root form me convert karne ke liye
from nltk.stem import PorterStemmer

# ---------------------------------------------------
# Ensure the NLTK stopwords resource is available.
# The download is attempted only if the local resource is missing.
# ---------------------------------------------------
try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", quiet=True)

# ---------------------------------------------------
# Flask application create kar rahe hain
# ---------------------------------------------------
app = Flask(__name__)

# Load environment variables from .env
load_dotenv()

# Secret key required for Flask sessions
app.secret_key = os.getenv("SECRET_KEY")

# Allow frontend to communicate with Flask
CORS(
    app,
    supports_credentials=True,
    origins=["http://127.0.0.1:5500"]
)

# Register authentication routes
app.register_blueprint(auth_bp)

# ---------------------------------------------------
# Trained model files.
# Resolve them relative to this file so the API works even if
# Flask is started from another working directory.
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "fake_news_model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")

model = pickle.load(open(model_path, "rb")) # Prediction engine

# TF-IDF Vectorizer load kar rahe hain
vectorizer = pickle.load(open(vectorizer_path, "rb")) # input Converter

# ---------------------------------------------------
# Stopwords aur Stemmer object bana rahe hain
# ---------------------------------------------------
stop_words = set(stopwords.words("english"))

ps = PorterStemmer()

# ---------------------------------------------------
# Text Preprocessing Function
# ---------------------------------------------------
def preprocess(text):

    # URL remove karo
    text = re.sub(r"http\S+", "", text)

    # Sirf alphabets rakho
    text = re.sub("[^a-zA-Z]", " ", text)

    # Lowercase me convert karo
    text = text.lower()

    # Sentence ko words me tod do
    words = text.split()

    # Stopwords remove + stemming
    words = [
        ps.stem(word)
        for word in words
        if word not in stop_words and len(word) > 2
    ]

    # Wapas sentence bana do
    return " ".join(words)
# ======================================
# Health Check API
# ======================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "online"
    })

# ---------------------------------------------------
# Prediction API
# URL:
# http://127.0.0.1:5001/predict
# ---------------------------------------------------
@app.route("/predict", methods=["POST"]) 
# When a 'POST' request arrives at '/predict' endpoint,execute the function below .

# @app.route(...) ---> Tells The Flask WHEN to call the Function

def predict():

    # ------------------------------------
    # Prediction start hone ka time store karo
    # Isse total processing time calculate hoga
    # ------------------------------------
    start_time = time.time()

    # Frontend se JSON data receive karo
    data = request.get_json()
    # HTTP Request ---(JSON body)---> request.get_json() ----> Python dictionary
    #request represent the current HTTP request sent by the client
    # the request object conatins the details of the request like => (method,path,json,header,args,body,form & cookies)

    # JSON me "news" key ki value lo
    news = data.get("news", "") #get the news value.if does not exist,use an empty string

    # Agar textbox empty hai to error bhejo
    if news.strip() == "":
        return jsonify({
            "error": "News text is empty"
        }), 400 
    # http status code 400 means "bad request" --> that means if an user input is empty or only whiteSpaces int return error 

    # News ko preprocess karo
    clean_news = preprocess(news)

    # TF-IDF vector me convert karo
    vector = vectorizer.transform([clean_news])

    # Prediction karo
    # 0 = REAL
    # 1 = FAKE
    prediction = model.predict(vector)[0]

    # Probability nikalo
    probability = model.predict_proba(vector)[0]

        # ------------------------------------
    # Real aur Fake probability nikalo
    # ------------------------------------

    real_probability = probability[0] * 100

    fake_probability = probability[1] * 100

    # Agar Fake hai
    if prediction == 1:

        label = "FAKE"

        confidence = probability[1] * 100

                # Fake prediction ka risk level
        if confidence >= 90:
            risk_level = "HIGH"
        elif confidence >= 70:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

    # Agar Real hai
    else:

        label = "REAL"

        confidence = probability[0] * 100

                # Real news generally Low Risk
        risk_level = "LOW"

            # ------------------------------------
    # Prediction complete hone ka time
    # ------------------------------------
    end_time = time.time()

    # Total processing time
    processing_time = round(end_time - start_time, 3)

    # ------------------------------------
    # Frontend ko JSON response bhejo
    # ------------------------------------
    return jsonify({

        # Prediction label
        "prediction": label,

        # Highest confidence
        "confidence": round(confidence, 2),

        # Actual Real probability
        "real_probability": round(real_probability, 2),

        # Actual Fake probability
        "fake_probability": round(fake_probability, 2),

        # Risk Level
        "risk_level": risk_level,

        # Processing time
        "processing_time": processing_time

    })
#EXAMPLE : ---> 
# {
#     "prediction": "FAKE",
#     "confidence": 94.52,
#     "real_probability": 5.48,
#     "fake_probability": 94.52,
#     "risk_level": "HIGH",
#     "processing_time": 0.023
# }



# ---------------------------------------------------
# Program start yahin se hoga
# ---------------------------------------------------
if __name__ == "__main__": #  it ensures that the flask development server starts only when the python file is executed directly.if the apllication is imported as a module by another file or server,app.run() won't execute automatically 
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    ) #app.run(..) --> This starts the Flask's development server 
                #  -->After this executes,Flasks listen for HTTP requests