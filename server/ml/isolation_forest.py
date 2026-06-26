import os
from datetime import datetime

import pandas as pd
import psycopg2
from dotenv import load_dotenv
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# -------------------------------
# Load Environment Variables
# -------------------------------
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

# -------------------------------
# Connect to Supabase
# -------------------------------
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

print("✅ Connected to Supabase")

# -------------------------------
# Read Users Table
# -------------------------------
query = """
SELECT
    id,
    username,
    risk_score,
    risk_level,
    status,
    created_at
FROM users;
"""

df = pd.read_sql(query, conn)

if df.empty:
    print("❌ No users found.")
    conn.close()
    exit()

# -------------------------------
# Feature Engineering
# -------------------------------
today = datetime.now()

df["account_age_days"] = (
    today - pd.to_datetime(df["created_at"])
).dt.days

status_map = {
    "active": 0,
    "suspended": 1,
    "blocked": 2
}

risk_level_map = {
    "Low": 0,
    "Medium": 1,
    "High": 2
}

df["status_encoded"] = (
    df["status"]
    .map(status_map)
    .fillna(0)
)

df["risk_level_encoded"] = (
    df["risk_level"]
    .map(risk_level_map)
    .fillna(0)
)

features = df[
    [
        "risk_score",
        "account_age_days",
        "status_encoded",
        "risk_level_encoded"
    ]
]

# -------------------------------
# Scale Features
# -------------------------------

scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)


# -------------------------------
# Train Isolation Forest
# -------------------------------
model = IsolationForest(
    n_estimators=300,
    contamination=0.10,
    max_samples="auto",
    random_state=42
)

model.fit(scaled_features)

df["prediction"] = model.predict(scaled_features)

# decision_function:
# Higher = normal
# Lower = anomaly

df["anomaly_score"] = model.decision_function(scaled_features)

print("\n====== Prediction Results ======\n")

print(
    df[
        [
            "username",
            "risk_score",
            "prediction",
            "anomaly_score"
        ]
    ]
)

# -------------------------------
# Clear old fake accounts
# -------------------------------
#cursor.execute("DELETE FROM fake_accounts;")
conn.commit()

# -------------------------------
# Insert suspicious accounts
# -------------------------------
insert_query = """
INSERT INTO fake_accounts
(
    user_id,
    suspicion_reason,
    anomaly_score,
    severity,
    status,
    detected_at
)
VALUES
(
    %s,
    %s,
    %s,
    %s,
    %s,
    NOW()
)
"""

for _, row in df.iterrows():

    if row["prediction"] == -1:

        anomaly = abs(float(row["anomaly_score"]))

        if anomaly > 0.20:
            severity = "HIGH"
        elif anomaly > 0.10:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        # -------------------------------
# Insert suspicious accounts
# -------------------------------
for _, row in df.iterrows():

    if row["prediction"] == -1:

        anomaly = abs(float(row["anomaly_score"]))

        # -------------------------
        # Better Severity Calculation
        # -------------------------

        severity_score = 0

        # Isolation Forest anomaly (40 marks)
        severity_score += min(anomaly * 180, 40)

        # Existing Risk Score (30 marks)
        severity_score += row["risk_score"] * 0.30

        # Account Age (10 marks)
        if row["account_age_days"] <= 7:
            severity_score += 10
        elif row["account_age_days"] <= 30:
            severity_score += 5

        # Account Status (10 marks)
        status = str(row["status"]).lower()

        if status == "blocked":
            severity_score += 10
        elif status == "suspended":
            severity_score += 7

        # Existing Risk Level (10 marks)
        risk_level = str(row["risk_level"]).lower()

        if risk_level == "high":
            severity_score += 10
        elif risk_level == "medium":
            severity_score += 5

        severity_score = min(100, severity_score)

        # Final Severity
        if severity_score >= 75:
            severity = "HIGH"
        elif severity_score >= 45:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        # -------------------------
        # Dynamic Suspicion Reason
        reasons = []

        # Main anomaly
        reasons.append("Isolation Forest detected abnormal behaviour")

        # Risk score
        if row["risk_score"] >= 90:
            reasons.append("Critical risk score")

        elif row["risk_score"] >= 75:
            reasons.append("High risk score")

        elif row["risk_score"] >= 60:
            reasons.append("Elevated risk score")

        # Account age
        if row["account_age_days"] <= 3:
            reasons.append("Very recently created account")

        elif row["account_age_days"] <= 7:
            reasons.append("New account")

        # Account status
        status = str(row["status"]).lower()

        if status == "blocked":
            reasons.append("Blocked account")

        elif status == "suspended":
            reasons.append("Suspended account")

        # High anomaly
        if anomaly >= 0.20:
            reasons.append("Very high anomaly score")

        elif anomaly >= 0.10:
            reasons.append("Moderate anomaly score")

        # Existing risk level
        risk_level = str(row["risk_level"]).lower()

        if risk_level == "high":
            reasons.append("Previously classified as high risk")

        elif risk_level == "medium":
            reasons.append("Previously classified as medium risk")

        # Fallback
        if len(reasons) == 1:
            reasons.append("Behaviour deviates from normal users")

        suspicion_reason = ", ".join(reasons)

        # -------------------------
        # Update users table
        # -------------------------

        # -------------------------
        # Calculate Updated Risk Score
        # -------------------------

        risk_score = round(
            min(
                100,
                (
                    row["risk_score"] * 0.45 +
                    severity_score * 0.55
                )
            )
        )

        cursor.execute(
            """
            UPDATE users
            SET
                risk_score = %s,
                risk_level = %s
            WHERE id = %s
            """,
            (
                risk_score,
                severity,
                str(row["id"])
            )
        )

        cursor.execute(
            "SELECT id FROM fake_accounts WHERE user_id = %s",
            (str(row["id"]),)
        )

        existing = cursor.fetchone()

        if existing:

            cursor.execute(
                """
                UPDATE fake_accounts
                SET
                    suspicion_reason = %s,
                    anomaly_score = %s,
                    severity = %s,
                    status = %s,
                    detected_at = NOW()
                WHERE user_id = %s
                """,
                (
                    suspicion_reason,
                    anomaly,
                    severity,
                    "UNDER_REVIEW",
                    str(row["id"])
                )
            )

        else:

            cursor.execute(
                insert_query,
                (
                    str(row["id"]),
                    suspicion_reason,
                    anomaly,
                    severity,
                    "UNDER_REVIEW"
                )
            )

# -------------------------------
# Generate Activity Logs
# -------------------------------

activity_query = """
INSERT INTO activity_logs
(
    user_id,
    activity_type,
    description,
    ip_address,
    created_at
)
VALUES
(
    %s,
    %s,
    %s,
    %s,
    NOW()
)
"""

# Remove previous logs generated for demo
#cursor.execute("DELETE FROM activity_logs;")

import random

for _, row in df.iterrows():

    if row["prediction"] == -1:

        activities = [
            (
                "LOGIN",
                "User logged in from an unfamiliar IP address",
                f"103.{random.randint(10,99)}.{random.randint(10,99)}.{random.randint(10,99)}"
            ),
            (
                "FAILED_LOGIN",
                "Multiple failed login attempts detected",
                f"182.{random.randint(10,99)}.{random.randint(10,99)}.{random.randint(10,99)}"
            ),
            (
                "PASSWORD_CHANGE",
                "Password changed shortly after login",
                f"103.{random.randint(10,99)}.{random.randint(10,99)}.{random.randint(10,99)}"
            ),
            (
                "PROFILE_UPDATE",
                "Account profile information updated",
                f"103.{random.randint(10,99)}.{random.randint(10,99)}.{random.randint(10,99)}"
            ),
        ]

        for activity in activities:

            cursor.execute(
                activity_query,
                (
                    str(row["id"]),
                    activity[0],
                    activity[1],
                    activity[2]
                )
            )

conn.commit()

print("\n fake_accounts table updated successfully!")

cursor.close()
conn.close()

print("\n Isolation Forest completed.")