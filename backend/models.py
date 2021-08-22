from sqlalchemy import Column, String, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, registry, relationship

Base = declarative_base()


class Calendar(Base):
    """
    The Calendar class represents a shell for events to be added to.
    """

    __tablename__ = "calendars"

    id = Column(UUID(as_uuid=True), primary_key=True)
    label = Column(String(length=60))
    passphrase = Column(String(length=60))

    # Relationship with events, users
    events = relationship("Event", back_populates="calendar")
    users = relationship("User", back_populates="calendar")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Event(Base):
    """
    The Event class represents an .ical event.
    """

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True)
    label = Column(String(length=60))
    body = Column(String(length=300))
    start_time = Column(TIMESTAMP(timezone=True))
    end_time = Column(TIMESTAMP(timezone=True))

    # Relationship with calendar
    calendar_id = Column(UUID(as_uuid=True), ForeignKey("calendars.id"))
    calendar = relationship("Calendar", back_populates="events")

    # Relationship with user
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    user = relationship("User", back_populates="events")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User(Base):
    """
    The User class someone who's accessed and added events to a calendar.
    """

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    label = Column(String(length=60))
    passphrase = Column(String(length=60))

    # Relationship with calendar
    calendar_id = Column(UUID(as_uuid=True), ForeignKey("calendars.id"))
    calendar = relationship("Calendar", back_populates="users")

    # Relationship with events
    events = relationship("Event", back_populates="user")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
