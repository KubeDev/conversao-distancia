#!/bin/sh
[ -n "$(docker images -q rogeriostos/conversao-distancia:v1)" ] || echo docker pull rogeriostos/conversao-distancia:v1

if [ ! "$(docker ps -q -f name=myapp)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=myapp)" ]; then
        # cleanup
        docker rm -f myapp
    fi
    # run your container
    docker container run -d --rm --name myapp -p 5000:5000 rogeriostos/conversao-distancia:v1
fi
[ -z "$(docker ps -q -f name=myapp)" ] || echo "\nAcesse a aplicação em http://localhost:5000/"
echo "\n"