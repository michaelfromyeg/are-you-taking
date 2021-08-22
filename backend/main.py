import logging, os
from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename

from transactions import create_calendar, get_calendar
from helpers import is_valid_uuid

logger = logging.getLogger()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024
app.config["UPLOAD_EXTENSIONS"] = [".ical", ".ics"]
app.config["UPLOAD_PATH"] = "uploads"


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/health")
def health():
    return {"status": "up"}


@app.route("/calendar", methods=["POST"])
def make_calendar():
    calendar = create_calendar()
    return calendar.as_dict()


@app.route("/calendar/<string:calendar_id>", methods=["GET"])
def get_calendar_by_id(calendar_id: str):
    if not is_valid_uuid(calendar_id):
        return "The ID of the calendar must be a valid UUID.", 400

    calendar = get_calendar(calendar_id)
    return calendar.as_dict()


@app.route("/calendar/<string:calendar_id>", methods=["PATCH"])
def update_calendar_by_id(calendar_id: str):
    if not is_valid_uuid(calendar_id):
        return "The ID of the calendar must be a valid UUID.", 400

    calendar = get_calendar(calendar_id)
    return calendar.as_dict()


@app.route("/calendar/upload", methods=["POST"])
def upload_calendar():
    uploaded_file = request.files["file"]
    filename = secure_filename(uploaded_file.filename)

    if filename != "":
        file_ext = os.path.splitext(filename)[1]
        if file_ext not in app.config["UPLOAD_EXTENSIONS"]:
            return "Invalid file type", 400
        uploaded_file.save(os.path.join(app.config["UPLOAD_PATH"], filename))

    return {"message": "ok"}


@app.route("/calendar/upload/<filename>", methods=["GET"])
def get_raw_calendar(filename):
    return send_from_directory(app.config["UPLOAD_PATH"], filename)
