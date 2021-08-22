# syntax=docker/dockerfile:1

FROM python:3.9.1

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

EXPOSE 5000

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

COPY . .

CMD [ "python3", "main.py"]
