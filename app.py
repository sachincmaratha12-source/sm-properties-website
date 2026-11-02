from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import csv
import os
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
CORS(app)

# Enquiry storage
DATA_FOLDER = Path(os.environ.get("DATA_DIR", BASE_DIR / "data"))
DATA_FOLDER.mkdir(parents=True, exist_ok=True)
CSV_FILE = DATA_FOLDER / "enquiries.csv"

# Website pages allowed to be served
ALLOWED_PAGES = {
    "index.html",
    "about.html",
    "projects.html",
    "contact.html",
    "northern-lights.html",
    "trees-and-tandem.html",
    "evergreen-park.html",
    "aveline.html",
    "nambiar-district-25.html",
    "assetz-niwa-and-neo.html"
}


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def website_files(filename):
    # Allow only website pages and public asset folders
    if filename in ALLOWED_PAGES:
        return send_from_directory(BASE_DIR, filename)

    if filename.startswith(("css/", "js/", "images/")):
        return send_from_directory(BASE_DIR, filename)

    return jsonify({"message": "Page not found"}), 404


@app.route("/submit-enquiry", methods=["POST"])
def submit_enquiry():
    data = request.get_json(silent=True) or {}

    def get_value(field):
        value = data.get(field, "")
        return str(value).strip() if value is not None else ""

    name = get_value("name")
    phone = get_value("phone")
    email = get_value("email")
    property_type = get_value("property_type")
    location = get_value("location")
    message = get_value("message")

    if not name or not phone:
        return jsonify({
            "success": False,
            "message": "Name and phone number are required."
        }), 400

    submitted_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    file_exists = CSV_FILE.exists()

    with open(CSV_FILE, "a", newline="", encoding="utf-8") as file:
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

    print(f"New enquiry received: {name} - {phone}")

    return jsonify({
        "success": True,
        "message": "Thank you. Your enquiry has been received."
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)