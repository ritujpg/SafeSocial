import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

# ----------------------------------------------------
# Paths
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

# ----------------------------------------------------
# Load Dataset
# ----------------------------------------------------

print("Loading Dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset Loaded : {len(df)} rows")

# ----------------------------------------------------
# Keep Required Columns
# ----------------------------------------------------

df = df[
    [
        "comment_text",
        "threat",
    ]
]

df = df.fillna("")

# ----------------------------------------------------
# Binary Labels
#
# 1 = Threat
# 0 = Normal
# ----------------------------------------------------

df["label"] = df["threat"]

print("\nDataset Distribution\n")

print(df["label"].value_counts())

# ----------------------------------------------------
# Features
# ----------------------------------------------------

X = df["comment_text"]

y = df["label"]

# ----------------------------------------------------
# TF-IDF
# ----------------------------------------------------

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=8000,
    ngram_range=(1, 2),
    min_df=2
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

print("\nTraining Threat Detection Random Forest...\n")

model = RandomForestClassifier(
    n_estimators=100,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)

print("Model Training Complete!")

# ----------------------------------------------------
# Evaluate Model
# ----------------------------------------------------

predictions = model.predict(X_test)

print("\nClassification Report\n")

print(
    classification_report(
        y_test,
        predictions,
        target_names=["Normal", "Threat"]
    )
)

accuracy = model.score(
    X_test,
    y_test
)

print("\n===================================")
print(f"Model Accuracy : {accuracy*100:.2f}%")
print("===================================\n")

# ----------------------------------------------------
# Save Model
# ----------------------------------------------------

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "threat_rf.pkl"
)

VECTORIZER_PATH = os.path.join(
    MODEL_DIR,
    "threat_vectorizer.pkl"
)

joblib.dump(model, MODEL_PATH)

joblib.dump(vectorizer, VECTORIZER_PATH)

print("Threat Detection Model Saved!")

joblib.dump(vectorizer, VECTORIZER_PATH)

print("Threat Vectorizer Saved!")

# ----------------------------------------------------
# Sample Predictions
# ----------------------------------------------------

sample_messages = [

    "Have a nice day!",

    "See you tomorrow.",

    "I know where you live.",

    "I will kill you.",

    "I'm coming for you tonight.",

    "You better watch your back.",

    "Thank you for your support."

]

print("\n========== SAMPLE PREDICTIONS ==========\n")

for message in sample_messages:

    vector = vectorizer.transform([message])

    prediction = model.predict(vector)[0]

    confidence = model.predict_proba(vector).max() * 100

    label = (
        "Threat"
        if prediction == 1
        else "Normal"
    )

    print(f"Message     : {message}")
    print(f"Prediction  : {label}")
    print(f"Confidence  : {confidence:.2f}%")
    print("----------------------------------------")

print("\nThreat Model Training Completed Successfully!")