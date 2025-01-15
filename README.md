<h4 align="center">
  DistanceConverter
</h4>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-functionalities">Functionalities</a> •
  <a href="#-how-to-run-it">How to Run It</a> •
  <a href="#-final-considerations">Final Considerations</a>
</p>

## 💻 About

This project is a forked API developed using Python which converts miles to meters and other distance conversions. There is an online Docker Hub Image to access this project on:
<h4 align="center">
  https://hub.docker.com/repository/docker/devsouzafs/distance-converter/general
</h4>

## ⚙️ Functionalities

- [x] Distance Converter:
  - [x] From Meters to Kilometers
  - [x] From Kilometers to Meters
  - [x] From Meters to Miles
  - [x] From Miles to Meters
  - [x] From Meters to feet
  - [x] From feet to Meters
  - [ ] From Inches to Feet
  - [ ] From Feet to Inches

## 🚀 How to Run It

This project needs the following steps to run it:

### Requirements

- [x] Git (Git Bash) or WSL Linux
- [x] Docker Engine or Docker Desktop

### Using Git Bash (or WSL Linux) to run the image on Docker

```bash

#Download the Image from Docker Hub 
$ docker image pull devsouzafs/distance-converter:v1 (or latest)

#Run it
$ docker container run -d -p 5000:5000 devsouzafs/distance-converter:v1 (or latest)

```

## 🧁 Final Considerations

This project are built to understand and learn concepts about Docker, Kubernetes, Github Actions, AWS, and so on. I look forward to implement new and modern technologies to improve a lot more.
