FROM python:3.11-rc-alpine
RUN pip install flask
COPY app.py /app.py
CMD ["python","app.py"]