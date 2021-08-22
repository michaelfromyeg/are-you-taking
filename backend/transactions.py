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


def create_calendar(label):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _create_calendar(s, label),
    )


def _create_calendar(session, label):
    """Create a new calendar with random ID and label."""
    logger.info("Creating new calendar")

    calendar_id = uuid.uuid4()
    new_calendar = Calendar(id=calendar_id, label=label)

    session.add(new_calendar)

    logger.info(f"Finished creating new calendar with ID {calendar_id}")

    return new_calendar


def get_calendar(calendar_id: str):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _get_calendar(s, calendar_id),
    )


def _get_calendar(session, calendar_id: str):
    """Return a calendar by it's ID."""
    logger.info(f"Fetching calendar with ID {calendar_id}")

    calendar = session.query(Calendar).get(calendar_id)

    return calendar


def delete_calendar(calendar_id: str):
    """Delete a calendar by its ID"""
    logger.warn(f"Deleting calendar with ID {calendar_id}")

    session = Session()
    try:
        calendar = session.query(Calendar).delete(calendar_id)
        session.expunge(calendar)
    finally:
        session.close()

    return calendar


def create_event(label, body, start_time, end_time, calendar_id):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _create_event(s, label, body, start_time, end_time, calendar_id),
    )


def _create_event(
    session, label: str, body: str, start_time: str, end_time: str, calendar_id: str
):
    """Create a new event."""
    logger.info("Creating new event")

    event_id = uuid.uuid4()
    new_event = Event(
        id=event_id,
        label=label,
        body=body,
        start_time=start_time,
        end_time=end_time,
        calendar_id=calendar_id,
    )

    session.add(new_event)

    logger.info(f"Finished creating new event with ID {event_id}")

    return new_event


def get_event(event_id: str):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _get_event(s, event_id),
    )


def _get_event(session, event_id: str):
    """Return an event by it's ID."""
    logger.info(f"Fetching event with ID {event_id}")

    event = session.query(Event).get(event_id)

    return event


def create_user(label: str, passphrase: str, calendar_id: str):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _create_user(s, label, passphrase, calendar_id),
    )


def _create_user(session, label: str, passphrase: str, calendar_id: str):
    """Create a new user, linked to a calendar."""
    logger.info(f"Creating new user")

    user_id = uuid.uuid4()
    new_user = User(
        id=user_id, label=label, passphrase=passphrase, calendar_id=calendar_id
    )

    session.add(new_user)

    logger.info(f"Finished creating new user with ID {user_id}")

    return new_user


def get_user(user_id: str):
    return run_transaction(
        sessionmaker(bind=engine, expire_on_commit=False),
        lambda s: _get_user(s, user_id),
    )


def _get_user(session, user_id: str):
    """Return a user by it's ID."""
    logger.info(f"Fetching user with ID {user_id}")

    user = session.query(User).get(user_id)

    return user


def get_events_by_calendar_id(calendar_id: str):
    """Return all events belonging to a given calendar ID."""
    logger.info(f"Getting events for calendar ID {calendar_id}")

    session = Session()
    try:
        events = (
            session.query(Event)
            .select_from(Calendar)
            .filter(Calendar.id == calendar_id)
            .all()
        )
        for event in events:
            session.expunge(event)
    finally:
        session.close()

    return events


def init_db():
    """
    Initialize the database, if need be.
    """
    db_uri = ""
    logger.info("Initializing the database...")
    os.system("cockroach sql --url='{0}' -f init.sql".format(db_uri))
    logger.info("Database initialized.")
