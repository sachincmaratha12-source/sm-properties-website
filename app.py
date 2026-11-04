
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
CORS(app)

GOOGLE_SCRIPT_URL = os.environ.get("GOOGLE_SCRIPT_URL")

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
    "assetz-niwa-and-neo.html",
    "godrej-woods.html",
    
}
ROOT_ASSETS = {
    "favicon.ico",
    "favicon.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
}


@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def website_files(filename):
    if filename in ALLOWED_PAGES or filename in ROOT_ASSETS:
        return send_from_directory(BASE_DIR, filename)

    if filename.startswith(("css/", "js/", "images/")):
        return send_from_directory(BASE_DIR, filename)

    return jsonify({"message": "Page not found"}), 404


@app.route("/submit-enquiry", methods=["POST"])
def submit_enquiry():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name") or "").strip()
    phone = str(data.get("phone") or "").strip()

    if not name or not phone:
        return jsonify({
            "success": False,
            "message": "Name and phone number are required."
        }), 400

    if not GOOGLE_SCRIPT_URL:
        return jsonify({
            "success": False,
            "message": "Enquiry service is not configured."
        }), 500

    try:
        response = requests.post(
            GOOGLE_SCRIPT_URL,
            json={
                "name": name,
                "phone": phone,
                "email": data.get("email", ""),
                "property_type": data.get("property_type", ""),
                "location": data.get("location", ""),
                "message": data.get("message", "")
            },
            timeout=30
        )

        response.raise_for_status()
        result = response.json()

        if not result.get("success"):
            raise Exception("Google Sheets did not confirm the enquiry.")

        return jsonify({
            "success": True,
            "message": "Thank you. Your enquiry has been received."
        })

    except Exception as error:
        app.logger.exception("Enquiry submission failed")
        return jsonify({
            "success": False,
            "message": "Unable to submit your enquiry. Please try again."
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)
