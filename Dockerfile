FROM python:3.10.12-slim

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install -r requirements.txt 

COPY . . 

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]