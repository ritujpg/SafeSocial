import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# ----------------------------------------------------
# Load Dataset
# ----------------------------------------------------

BASE_DIR = os.path.dirname(__file__)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "train.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

os.makedirs(MODEL_DIR, exist_ok=True)

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset Loaded : {len(df)} rows")

# ----------------------------------------------------
# Keep only required columns
# ----------------------------------------------------

df = df[
    [
        "comment_text",
        "toxic",
        "severe_toxic",
        "obscene",
        "threat",
        "insult",
        "identity_hate",
    ]
]

df = df.fillna("")

# ----------------------------------------------------
# Convert Dataset Labels
#
# 0 -> Normal
# 1 -> Cyberbullying
# 2 -> Threat
# ----------------------------------------------------

def create_label(row):

    if row["threat"] == 1 or row["severe_toxic"] == 1:
        return "Threat"

    if (
        row["toxic"] == 1
        or row["obscene"] == 1
        or row["insult"] == 1
        or row["identity_hate"] == 1
    ):
        return "Cyberbullying"

    return "Normal"

df["label"] = df.apply(create_label, axis=1)

print("\nClass Distribution\n")
print(df["label"].value_counts())

# ----------------------------------------------------
# Features & Labels
# ----------------------------------------------------

X = df["comment_text"]

y = df["label"]

# ----------------------------------------------------
# TF-IDF
# ----------------------------------------------------

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=10000
)

X = vectorizer.fit_transform(X)

# ----------------------------------------------------
# Train Test Split
# ----------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)
# ----------------------------------------------------
# Train Random Forest
# ----------------------------------------------------

print("\nTraining Random Forest Model...\n")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Model Training Complete!")

# ----------------------------------------------------
# Evaluate Model
# ----------------------------------------------------

accuracy = model.score(X_test, y_test)

print("\n===================================")
print(f"Model Accuracy : {accuracy * 100:.2f}%")
print("===================================\n")

# ----------------------------------------------------
# Save Model
# ----------------------------------------------------

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "random_forest_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    MODEL_DIR,
    "tfidf_vectorizer.pkl"
)

joblib.dump(model, MODEL_PATH)

joblib.dump(vectorizer, VECTORIZER_PATH)

print("Random Forest Model Saved")

print("TF-IDF Vectorizer Saved")

# ----------------------------------------------------
# Quick Test
# ----------------------------------------------------

sample_messages = [

    "Have a nice day!",

    "You are an idiot and nobody likes you.",

    "I know where you live. I will kill you.",

    "You deserve to die.",

    "Thanks for helping me today."

]

print("\n========== SAMPLE PREDICTIONS ==========\n")

for message in sample_messages:

    vector = vectorizer.transform([message])

    prediction = model.predict(vector)[0]

    probability = model.predict_proba(vector).max() * 100

    print(f"Message     : {message}")
    print(f"Prediction  : {prediction}")
    print(f"Confidence  : {probability:.2f}%")
    print("----------------------------------------")