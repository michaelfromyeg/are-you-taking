import logging, os, datetime

from flask import Flask, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from dotenv import load_dotenv

from src.transactions import (
    # db_conn,
    get_calendar,
    create_calendar,
    get_event,
    get_events_by_calendar_id,
    create_event,
    get_user,
    get_users_by_calendar_id,
    create_user,
)
from src.helpers import is_valid_uuid
from src.ical import parse_and_save_calendar

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024
app.config["UPLOAD_EXTENSIONS"] = [".ical", ".ics"]
app.config["UPLOAD_PATH"] = "uploads"

cors = CORS(app)


@app.route("/")
def hello():
    return "are-you-taking is live!"


@app.route("/health", methods=["GET"])
def health():
    return {"status": "up"}


@app.route("/calendar", methods=["POST"])
def make_calendar():
    label = request.form.get("label")

    calendar = create_calendar(label=label)

    return calendar.as_dict()


@app.route("/calendar/<string:calendar_id>", methods=["GET"])
def get_calendar_by_id(calendar_id: str):
    if not is_valid_uuid(calendar_id):
        return "The ID of the calendar must be a valid UUID.", 400

    # TODO: make this faster; no need for multiple queries... can be one complex join instead!
    calendar = get_calendar(calendar_id)
    events = get_events_by_calendar_id(calendar_id)
    users = get_users_by_calendar_id(calendar_id)

    if calendar is None:
        return "No calendar found", 404

    response = calendar.as_dict()
    response["events"] = [event.as_dict() for event in events]
    response["users"] = [user.as_dict() for user in users]

    return response


# TODO: add logic to update existing calendar fields
@app.route("/calendar/<string:calendar_id>", methods=["PATCH"])
def update_calendar_by_id(calendar_id: str):
    if not is_valid_uuid(calendar_id):
        return "The ID of the calendar must be a valid UUID.", 400

    calendar = get_calendar(calendar_id)

    return calendar.as_dict()


@app.route("/calendar/<string:calendar_id>/upload", methods=["POST"])
def upload_calendar(calendar_id: str):
    uploaded_file = None
    logger.info(request.files)
    try:
        uploaded_file = request.files["file"]
    except KeyError:
        logger.warn("No file given in upload")

    if uploaded_file is not None:
        filename = secure_filename(uploaded_file.filename)
        if filename != "":
            file_ext = os.path.splitext(filename)[1]
            if file_ext not in app.config["UPLOAD_EXTENSIONS"]:
                return "Invalid file type", 400
            uploaded_file.save(os.path.join(app.config["UPLOAD_PATH"], filename))

    # Other options for uploads
    gcal_url = request.form.get("gcal_url")
    ical_url = request.form.get("ical_url")

    # The user ID the events will be attached to
    user_id = request.form.get("user_id")

    parse_and_save_calendar(
        path=os.path.join(app.config["UPLOAD_PATH"], filename)
        if uploaded_file is not None
        else "",
        gcal_url=gcal_url,
        ical_url=ical_url,
        calendar_id=calendar_id,
        user_id=user_id,
    )

    return {"message": "ok"}


@app.route("/calendar/<string:calendar_id>/upload/<string:filename>", methods=["GET"])
def get_raw_calendar(calendar_id: str, filename: str):
    """Fetch a raw .ics file by its filename; only for debugging."""
    return send_from_directory(app.config["UPLOAD_PATH"], filename)


# TODO: turn these into form fields, instead of hard-coded values
@app.route("/event", methods=["GET"])
def make_event():
    label = request.form.get("label")
    body = request.form.get("body")
    calendar_id = request.form.get("calendar_id")
    user_id = request.form.get("user_id")

    event = create_event(
        label=label,
        body=body,
        start_time=datetime.datetime.utcnow(),
        end_time=datetime.datetime.utcnow(),
        calendar_id=calendar_id,
        user_id=user_id,
    )

    return event.as_dict()


@app.route("/event/<string:event_id>", methods=["GET"])
def get_event_by_id(event_id: str):
    if not is_valid_uuid(event_id):
        return "The ID of the event must be a valid UUID.", 400

    event = get_event(event_id)

    if event is None:
        return "No event found", 404

    return event.as_dict()


# TODO: turn these into form fields, instead of hard-coded values
@app.route("/user", methods=["POST"])
def make_user():
    label = request.form.get("label")
    passphrase = request.form.get("passphrase")
    calendar_id = request.form.get("calendar_id")

    user = create_user(
        label=label,
        passphrase=passphrase,
        calendar_id=calendar_id,
    )

    return user.as_dict()


@app.route("/user/<string:user_id>", methods=["GET"])
def get_user_by_id(user_id: str):
    if not is_valid_uuid(user_id):
        return "The ID of the user must be a valid UUID.", 400

    user = get_user(user_id)

    if user is None:
        return "No user found", 404

    return user.as_dict()


if __name__ == "__main__":
    load_dotenv()
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
