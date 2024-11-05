FROM python:3.13.0
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . /app/
EXPOSE 5000
CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "app:app" ]

# to build the image using the cli you can try the following: 
#   docker build -t conversao-distancia .
# to create the image using the naming convention go with:
#   docker build -t <docker_hub_username>/conversao-distancia .
# finally, to upload the image:
#   docker login
#   docker push
# to update the tag from v1 to latest:
#   docker tag <docker_hub_username>/conversao-distancia:v1 <docker_hub_username>/conversao-distancia:latest
