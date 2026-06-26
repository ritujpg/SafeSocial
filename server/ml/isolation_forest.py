import os
from datetime import datetime

import pandas as pd
import psycopg2
from dotenv import load_dotenv
from sklearn.ensemble import IsolationForest

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
# Train Isolation Forest
# -------------------------------
model = IsolationForest(
    contamination=0.15,
    random_state=42
)

model.fit(features)

df["prediction"] = model.predict(features)

# decision_function:
# Higher = normal
# Lower = anomaly

df["anomaly_score"] = model.decision_function(features)

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
        # Severity
        # -------------------------
        if anomaly >= 0.20:
            severity = "HIGH"
        elif anomaly >= 0.10:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        # -------------------------
        # Dynamic Suspicion Reason
        # -------------------------
        reasons = []

        # Isolation Forest always detected anomaly
        reasons.append("Statistical anomaly detected by Isolation Forest")

        if row["risk_score"] >= 90:
            reasons.append("Extremely high user risk score")

        elif row["risk_score"] >= 70:
            reasons.append("High user risk score")

        if row["account_age_days"] <= 7:
            reasons.append("Recently created account")

        if str(row["status"]).lower() == "suspended":
            reasons.append("Suspended account activity")

        # If no specific reason matched
        if len(reasons) == 1:
            reasons.append("Unusual behavioural pattern detected")

        suspicion_reason = ", ".join(reasons)

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