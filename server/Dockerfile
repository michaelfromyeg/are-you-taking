# syntax=docker/dockerfile:1

FROM python:3.9.1

ENV PYTHONUNBUFFERED True

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD exec gunicorn --bind 8000 --workers 1 --threads 8 --timeout 0 main:app
