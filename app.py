from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__)

CORS(app)


# =========================================================
# DATA FOLDER
# =========================================================

DATA_FOLDER = "data"
CSV_FILE = os.path.join(DATA_FOLDER, "enquiries.csv")

os.makedirs(DATA_FOLDER, exist_ok=True)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return "SM Properties backend is working!"


# =========================================================
# SUBMIT ENQUIRY
# =========================================================

@app.route("/submit-enquiry", methods=["POST"])
def submit_enquiry():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    property_type = data.get("property_type", "").strip()
    location = data.get("location", "").strip()
    message = data.get("message", "").strip()

    if not name or not phone:
        return jsonify({
            "success": False,
            "message": "Name and phone number are required."
        }), 400


    submitted_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    file_exists = os.path.exists(CSV_FILE)


    with open(
        CSV_FILE,
        mode="a",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "Date & Time",
                "Name",
                "Phone",
                "Email",
                "Property Type",
                "Preferred Location",
                "Message"
            ])

        writer.writerow([
            submitted_at,
            name,
            phone,
            email,
            property_type,
            location,
            message
        ])


    print("\n===== NEW SM PROPERTIES ENQUIRY =====")
    print(f"Date & Time: {submitted_at}")
    print(f"Name: {name}")
    print(f"Phone: {phone}")
    print(f"Email: {email}")
    print(f"Property Type: {property_type}")
    print(f"Location: {location}")
    print(f"Message: {message}")
    print("=====================================\n")


    return jsonify({
        "success": True,
        "message": "Thank you. Your enquiry has been received."
    })


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )