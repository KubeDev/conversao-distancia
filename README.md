# conversao-distancia

Aplicação utilizada como exemplo em um dos eventos do Fabrício Veronez.
semana do dia 2025-01-13.


#Comando para fazer o build e publicar no dockerHub:
docker build -t eliemarbueno/c
onversao-distancia:v1 -f Dockerfile .

#Comando para rodar o container local:
docker run -p 5000:5000 eliemarbueno/conversao-distancia:v1
