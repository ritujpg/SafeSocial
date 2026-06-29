import os
import sys
import json
import joblib
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS_DIR = os.path.join(
    BASE_DIR,
    "models"
)

# ------------------------
# Load Models
# ------------------------

cyber_model = joblib.load(
    os.path.join(
        MODELS_DIR,
        "cyberbullying_rf.pkl"
    )
)

cyber_vectorizer = joblib.load(
    os.path.join(
        MODELS_DIR,
        "cyberbullying_vectorizer.pkl"
    )
)

threat_model = joblib.load(
    os.path.join(
        MODELS_DIR,
        "threat_rf.pkl"
    )
)

threat_vectorizer = joblib.load(
    os.path.join(
        MODELS_DIR,
        "threat_vectorizer.pkl"
    )
)

# ------------------------
# Threat Keywords
# ------------------------

THREAT_KEYWORDS = [

    "kill",
    "murder",
    "die",
    "death",
    "shoot",
    "stab",
    "bomb",
    "burn",
    "attack",
    "explode",
    "hang",
    "slaughter",
    "assassinate",
    "destroy",
    "eliminate",

    "i will kill you",
    "i'll kill you",
    "i know where you live",
    "watch your back",
    "you're dead",
    "you are dead",
    "coming for you",
    "i'm coming for you",
    "hunt you",
    "beat you up",
    "end your life",
    "kill your family",
    "you won't survive",
    "see you in hell",
    "bury you"

]

# ------------------------
# Clean Text
# ------------------------

def clean_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    return text


# ------------------------
# Keyword Detector
# ------------------------

def keyword_threat_score(text):

    text = clean_text(text)

    score = 0

    matched = []

    for keyword in THREAT_KEYWORDS:

        if keyword in text:

            score += 1

            matched.append(keyword)

    return score, matched

    # ------------------------
# AI Analysis
# ------------------------

def analyze_message(message):

    message = message.strip()

    if message == "":

        return {
            "category": "Unknown",
            "confidence": 0,
            "keywords": []
        }

    # ------------------------
    # Threat RF
    # ------------------------

    threat_features = threat_vectorizer.transform([message])

    threat_prediction = threat_model.predict(threat_features)[0]

    threat_probability = max(
        threat_model.predict_proba(threat_features)[0]
    )

    # ------------------------
    # Cyberbullying RF
    # ------------------------

    cyber_features = cyber_vectorizer.transform([message])

    cyber_prediction = cyber_model.predict(cyber_features)[0]

    cyber_probability = max(
        cyber_model.predict_proba(cyber_features)[0]
    )

    # ------------------------
    # Keyword Detection
    # ------------------------

    keyword_score, matched_keywords = keyword_threat_score(message)

    # ------------------------
    # Hybrid Threat Logic
    # ------------------------

    if keyword_score >= 2:

        return {

            "category": "Threat",

            "confidence": round(
                max(
                    threat_probability * 100,
                    95
                ),
                2
            ),

            "keywords": matched_keywords

        }

    if threat_prediction == 1:

        return {

            "category": "Threat",

            "confidence": round(
                threat_probability * 100,
                2
            ),

            "keywords": matched_keywords

        }

    if cyber_prediction == 1:

        return {

            "category": "Cyberbullying",

            "confidence": round(
                cyber_probability * 100,
                2
            ),

            "keywords": []

        }

    return {

        "category": "Normal",

        "confidence": round(

            max(
                threat_probability,
                cyber_probability
            ) * 100,

            2

        ),

        "keywords": []

    }


# ------------------------
# Main
# ------------------------

if __name__ == "__main__":

    message = sys.argv[1]

    result = analyze_message(message)

    print(
        json.dumps(result)
    )