SET sql_safe_updates = FALSE;

USE defaultdb;
DROP DATABASE IF EXISTS ayt CASCADE;
CREATE DATABASE IF NOT EXISTS ayt;

USE ayt;

CREATE TABLE calendars (
    id UUID PRIMARY KEY,
    label VARCHAR(60),
    passphrase VARCHAR(60)
);

CREATE TABLE events (
    id UUID PRIMARY KEY,
    label VARCHAR(60),
    body VARCHAR(300),
    scheduled_time TIMESTAMP,
    calendar_id UUID REFERENCES calendars(id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    label VARCHAR(60),
    passphrase VARCHAR(60),
    calendar_id UUID REFERENCES calendars(id)
);