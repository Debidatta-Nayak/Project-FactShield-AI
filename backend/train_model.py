import pandas as pd
import numpy as np
import re
import nltk
import pickle
import matplotlib.pyplot as plt

from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# ==========================================================
# DOWNLOAD STOPWORDS
# ==========================================================

nltk.download('stopwords')

# ==========================================================
# LOAD DATASET
# ==========================================================

# Upload BOTH files in Google Colab:
# 1. Fake.csv
# 2. True.csv

fake_df = pd.read_csv("../dataset/Fake.csv")
true_df = pd.read_csv("../dataset/True.csv")

# Add labels
fake_df['label'] = 'Fake'
true_df['label'] = 'Real'

# Combine datasets
df = pd.concat([fake_df, true_df], ignore_index=True)

print("Dataset Loaded Successfully")

# ==========================================================
# HANDLE MISSING VALUES
# ==========================================================

df.dropna(subset=['title', 'text'], inplace=True)

# ==========================================================
# CREATE CONTENT COLUMN
# ==========================================================

df['content'] = (
    df['title'].astype(str)
    + " " +
    df['text'].astype(str)
)

# Convert labels into numbers
# Fake = 1
# Real = 0

df['label_num'] = df['label'].map({
    'Fake': 1,
    'Real': 0
})

# Keep useful columns
df = df[['content', 'label', 'label_num']]

# Remove duplicates
df.drop_duplicates(inplace=True)

print("Total Records:", len(df))

# ==========================================================
# TEXT PREPROCESSING
# ==========================================================

stop_words = set(stopwords.words('english'))

ps = PorterStemmer()

def preprocess(text):

    # Remove URLs
    text = re.sub(r'http\S+', '', text)

    # Remove special characters
    text = re.sub('[^a-zA-Z]', ' ', text)

    # Convert to lowercase
    text = text.lower()

    # Split into words
    words = text.split()

    # Remove stopwords + stemming
    words = [
        ps.stem(word)
        for word in words
        if word not in stop_words and len(word) > 2
    ]

    return " ".join(words)

# Apply preprocessing
df['content'] = df['content'].apply(preprocess)

print("\nText Preprocessing Completed")

# ==========================================================
# TF-IDF VECTORIZATION
# ==========================================================

vectorizer = TfidfVectorizer(
    max_features=15000,
    ngram_range=(1,2),
    min_df=3,
    max_df=0.75,
    stop_words='english',
    sublinear_tf=True
)

X = vectorizer.fit_transform(df['content'])

y = df['label_num']

print("\nTF-IDF Vectorization Completed")

# ==========================================================
# TRAIN TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Shape:", X_train.shape)
print("Testing Shape :", X_test.shape)

# ==========================================================
# TRAIN MODELS
# ==========================================================

# Logistic Regression

lr_model = LogisticRegression(
    C=5,
    max_iter=500,
    solver='liblinear'
)

lr_model.fit(X_train, y_train)

lr_pred = lr_model.predict(X_test)

# Naive Bayes

nb_model = MultinomialNB()

nb_model.fit(X_train, y_train)

nb_pred = nb_model.predict(X_test)

# Random Forest

rf_model = RandomForestClassifier(
    n_estimators=30,
    max_depth=15,
    random_state=42
)

rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)

# ==========================================================
# ACCURACY
# ==========================================================

lr_acc = accuracy_score(y_test, lr_pred)
nb_acc = accuracy_score(y_test, nb_pred)
rf_acc = accuracy_score(y_test, rf_pred)

print("\n===== MODEL ACCURACY =====")

print(f"Logistic Regression Accuracy : {lr_acc*100:.2f}%")
print(f"Naive Bayes Accuracy         : {nb_acc*100:.2f}%")
print(f"Random Forest Accuracy       : {rf_acc*100:.2f}%")

# ==========================================================
# CLASSIFICATION REPORT
# ==========================================================

print("\n===== CLASSIFICATION REPORT =====")

print(classification_report(
    y_test,
    lr_pred,
    target_names=['Real', 'Fake']
))

# ==========================================================
# SAVE MODEL
# ==========================================================

pickle.dump(
    lr_model,
    open('fake_news_model.pkl', 'wb')
)

pickle.dump(
    vectorizer,
    open('tfidf_vectorizer.pkl', 'wb')
)

print("\nModel Saved Successfully")

# ==========================================================
# SAMPLE TESTING
# ==========================================================

sample_news = [

    # Fake
    "Scientists confirm a conspiracy to control weather using secret machines",

    # Real
    "The government passed a new healthcare bill after parliamentary debate",

    # Fake
    "Aliens have landed in New York and taken control of the city",

    # Real
    "The stock market closed higher after positive economic reports"
]

# ==========================================================
# PREDICTION FUNCTION
# ==========================================================

def predict_news_all_models(text):

    text = preprocess(text)

    vector = vectorizer.transform([text])

    # Logistic Regression
    lr_prob = lr_model.predict_proba(vector)[0]

    # Naive Bayes
    nb_prob = nb_model.predict_proba(vector)[0]

    # Random Forest
    rf_prob = rf_model.predict_proba(vector)[0]

    return {
        "Logistic Regression": lr_prob,
        "Naive Bayes": nb_prob,
        "Random Forest": rf_prob
    }

# ==========================================================
# SAMPLE OUTPUTS
# ==========================================================

print("\n===== SAMPLE PREDICTIONS =====")

for news in sample_news:

    print("\nNEWS:")
    print(news)

    probs = predict_news_all_models(news)

    for model_name, prob in probs.items():

        real_prob = prob[0] * 100
        fake_prob = prob[1] * 100

        prediction = "REAL" if real_prob > fake_prob else "FAKE"

        confidence = max(real_prob, fake_prob)

        print(f"\n{model_name}")

        print(f"Prediction      : {prediction}")

        print(f"Real Probability: {real_prob:.2f}%")

        print(f"Fake Probability: {fake_prob:.2f}%")

        print(f"Confidence Score: {confidence:.2f}%")

# ==========================================================
# MODEL COMPARISON GRAPH
# ==========================================================

plt.figure(figsize=(8,5))

model_names = [
    "Logistic Regression",
    "Naive Bayes",
    "Random Forest"
]

accuracies = [
    lr_acc * 100,
    nb_acc * 100,
    rf_acc * 100
]

plt.bar(model_names, accuracies)

plt.ylabel("Accuracy (%)")

plt.title("Model Accuracy Comparison")

# Accuracy values on bars

for i, value in enumerate(accuracies):

    plt.text(
        i,
        value + 0.2,
        f"{value:.2f}%",
        ha='center'
    )

plt.ylim(80, 100)

plt.show()

# ==========================================================
# CONFUSION MATRIX FUNCTION
# ==========================================================

def plot_confusion_matrix(y_true, y_pred, model_name):

    cm = confusion_matrix(y_true, y_pred)

    tn, fp, fn, tp = cm.ravel()

    plt.figure(figsize=(7,6))

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=["Real", "Fake"]
    )

    disp.plot(cmap='Blues')

    plt.title(f"Confusion Matrix — {model_name}")

    plt.show()

    print(f"\n===== {model_name} =====")

    print(f"True Positives (Fake→Fake) : {tp}")

    print(f"True Negatives (Real→Real) : {tn}")

    print(f"False Positives (Real→Fake): {fp}")

    print(f"False Negatives (Fake→Real): {fn}")

# ==========================================================
# CONFUSION MATRIX FOR ALL MODELS
# ==========================================================

plot_confusion_matrix(
    y_test,
    lr_pred,
    "Logistic Regression"
)

plot_confusion_matrix(
    y_test,
    nb_pred,
    "Naive Bayes"
)

plot_confusion_matrix(
    y_test,
    rf_pred,
    "Random Forest"
)

# ==========================================================
# PROBABILITY GRAPH FOR ALL MODELS
# ==========================================================

test_news = """
The government announced a new education policy
after discussions in parliament
"""

vector = vectorizer.transform([preprocess(test_news)])

# Logistic Regression
lr_prob = lr_model.predict_proba(vector)[0]

# Naive Bayes
nb_prob = nb_model.predict_proba(vector)[0]

# Random Forest
rf_prob = rf_model.predict_proba(vector)[0]

models = [
    "Logistic Regression",
    "Naive Bayes",
    "Random Forest"
]

real_probs = [
    lr_prob[0] * 100,
    nb_prob[0] * 100,
    rf_prob[0] * 100
]

fake_probs = [
    lr_prob[1] * 100,
    nb_prob[1] * 100,
    rf_prob[1] * 100
]

x = np.arange(len(models))

width = 0.35

plt.figure(figsize=(10,6))

plt.bar(
    x - width/2,
    real_probs,
    width,
    label='Real'
)

plt.bar(
    x + width/2,
    fake_probs,
    width,
    label='Fake'
)

plt.xticks(x, models)

plt.ylabel("Probability (%)")

plt.title("Real vs Fake Probability — All Three Models")

plt.legend()

# Add values on bars

for i in range(len(models)):

    plt.text(
        x[i] - width/2,
        real_probs[i] + 1,
        f"{real_probs[i]:.1f}%",
        ha='center'
    )

    plt.text(
        x[i] + width/2,
        fake_probs[i] + 1,
        f"{fake_probs[i]:.1f}%",
        ha='center'
    )

plt.show()

# ==========================================================
# CLASS DISTRIBUTION GRAPH
# ==========================================================

plt.figure(figsize=(6,5))

df['label'].value_counts().plot(
    kind='bar'
)

plt.title("Class Distribution (Real vs Fake)")

plt.xlabel("News Type")

plt.ylabel("Count")

plt.show()