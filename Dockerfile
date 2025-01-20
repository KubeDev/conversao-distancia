FROM python
WORKDIR /app
COPY requirements.txt .
run pip install -r requirements.txt
COPY . /app
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]