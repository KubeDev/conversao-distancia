FROM python:3.12.3
WORKDIR /app
COPY requirements.txt .
RUN python -m pip install -r requirements.txt
COPY . .
CMD ["gunicorn","--bind","0.0.0.0:5000","app:app"]
