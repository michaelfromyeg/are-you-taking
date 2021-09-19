import logging, datetime
from icalendar.prop import vDDDTypes, vDatetime
from icalevents.icalevents import events
from icalendar import Calendar, Event, vText

from src.transactions import create_event

from pprint import pprint

logger = logging.getLogger()


def parse_and_save_calendar(
    path: str, gcal_url: str, ical_url: str, calendar_id: str, user_id: str
):
    """ """

    cal = None
    if path:
        cal = parse_path(path)
    elif gcal_url:
        cal = parse_gcal(gcal_url)
    elif ical_url:
        cal = parse_ical(ical_url)

    if cal is None:
        return "ok"

    save_calendar(cal, calendar_id=calendar_id, user_id=user_id)

    return "ok"


def parse_path(path):
    f = open(path, "r")
    cal = Calendar().from_ical(f.read())
    f.close()

    return cal


def parse_gcal(gcal_url: str):
    es = events(url=gcal_url)
    logger.info(es)

    return es


def parse_ical(ical_url: str):
    es = events(url=ical_url, fix_apple=True)
    logger.info(es)

    return es


def display(cal):
    return cal.to_ical().replace("\r\n", "\n").strip()


def save_calendar(cal, calendar_id: str, user_id: str):
    """ """
    for event in cal.subcomponents:
        try:
            # Get all fields from ical format
            label = vText.from_ical(event["SUMMARY"])
            body = vText.from_ical(event["DESCRIPTION"])[0:300].replace("\n", "")
            start_time = vDDDTypes.from_ical(event["DTSTART"])
            end_time = vDDDTypes.from_ical(event["DTEND"])

            start_time = start_time.replace(tzinfo=None)
            end_time = end_time.replace(tzinfo=None)

            logger.info(f"Creating event for {label} at {start_time}")
            create_event(
                label=label,
                body=body,
                start_time=start_time,
                end_time=end_time,
                calendar_id=calendar_id,
                user_id=user_id,
            )
        except KeyError:
            logger.warn("Got key error in calendar")
            continue
