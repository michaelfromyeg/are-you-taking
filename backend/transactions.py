import os, uuid, logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_cockroachdb import run_transaction

from models import Calendar, Event, User


logger = logging.getLogger()

db_uri = os.environ.get("DB_CONNECTION")
psycopg_uri = (
    db_uri.replace("postgresql://", "cockroachdb://")
    .replace("postgres://", "cockroachdb://")
    .replace("26257?", "26257/ayt?")
)

engine = create_engine(psycopg_uri)

Session = sessionmaker(engine)


def create_calendar():
    """Create a new calendar with random ID and label."""
    logger.info("Creating new calendar")

    calendar_id = uuid.uuid4()
    label = "Hello, world!"
    new_calendar = Calendar(id=calendar_id, label=label)

    session = Session()
    try:
        session.add(new_calendar)
        session.expunge(new_calendar)
        session.commit()
    finally:
        session.close()

    return new_calendar


def get_calendar(calendar_id: int):
    """Return a calendar by it's ID."""
    logger.info(f"Fetching calendar with ID {calendar_id}")

    session = Session()
    try:
        calendar = session.query(Calendar).get(calendar_id)
        session.expunge(calendar)
    finally:
        session.close()

    return calendar


def delete_calendars(session, num):
    """Delete N existing calendars, at random."""
    print("Deleting existing calendars...")
    delete_ids = []

    calendars = session.query(Calendar).filter(Calendar.id.in_(delete_ids)).all()

    for calendar in calendars:
        print(f"Deleting calendar {calendar.id}.")
        session.delete(calendar)


def init_db():
    """
    Initialize the database, if need be.
    """
    db_uri = ""
    logger.info("Initializing the database...")
    os.system("cockroach sql --url='{0}' -f init.sql".format(db_uri))
    logger.info("Database initialized.")
