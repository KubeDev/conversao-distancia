
# Docker + Python

Neste exemplo de conteinerização, vou utilizar uma aplicação em Python para mostrar como configurar o usuário da aplicação, limitando-o à sua pasta base.
Para testar esta aplicação dentro de um contêiner, vocẽ precisa ter o <a href="https://docs.docker.com/get-docker/" target="_blank" title="Docker">Docker</a> instalado em sua máquina. 
Caso não deseje saber sobre o arquivo de conteinerização Dockerfile, vá direto para a sessão [Testando a aplicação](#testando_aplicacao "Testando a aplicação").


## Dockerfile

A grosso modo, entenda o Dockerfile como uma "__receita__" que será utilizada para gerar o contêiner.

Primeiro vamos indicar a imagem que utilizaremos como base para a nossa imagem. Para isto utilizaremos o comando `FROM` e o nome da imagem base.
```Docker
FROM python:3.10.0-alpine
```
A imagem `pyhon:3.10.0-alpine`, é uma imagem oficial de Python na versão 3.10. 

No início da execução do arquivo, o usuário utilizado é o `root` e não queremos executar a aplicação com um usuário com tantos privilégios. Então vamos criar o usuário `appuser`.
```Docker
RUN adduser -D appuser
```
Após a criação do usuário, vamos definir a pasta base do usuário como nosso o diretório de trabalho. O comando abaixo, cria a pasta, caso ela não exista, e nos move para dentro da pasta.
```Docker
WORKDIR /home/appuser
```
Para garantir que a aplicação seja executada da forma correta pelo o usuário `appuser` temos que criar a pasta que acomodará as dependências da aplicação e como ainda estamos utilizando o usuário `root`, temos que definir o usuário `appuser` como o proprietário das pastas criadas.

```Docker
RUN mkdir -p ./.local/bin && chown -R appuser:appuser ./.local
```
A pasta ainda está vazia, mas já vamos incluí-la na variável de ambiente __PATH__.
```Docker
ENV PATH="/home/appuser/.local/bin:${PATH}"
```
Agora vamos trocar de usuário para continuar inserindo comandos em nosso arquivo.
```Docker
USER appuser
```
Deste ponto em diante os comandos serão executados pelo o usuário `appuser`. 
Agora vamos copiar o arquivo de pendências da aplicação para dentro do contêiner, mais precisamente para a pasta do usuário e instalar as dependências.
```Docker
COPY requirements.txt .
RUN pip3 install --user -r ./requirements.txt
```
Para finalizar o arquivo Dockerfile, vamos copiar o restante dos arquivos da aplicação para a pasta do usuário e inserir o comando de start da aplicação de forma imutável
```Docker
COPY  . .
ENTRYPOINT [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
```
O arquivo final ficará assim:
```Docker
FROM python:3.10.0-alpine

RUN adduser -D appuser

WORKDIR /home/appuser

RUN mkdir -p ./.local/bin && chown -R appuser:appuser ./.local

ENV PATH="/home/appuser/.local/bin:${PATH}"

USER appuser

COPY requirements.txt .

RUN pip3 install --user -r ./requirements.txt

COPY  . .

ENTRYPOINT [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

```
Ótimo, com a “receita” pronta, vamos criar nossa imagem. 
```bash
docker build -t minha-aplicacao:v1 ./Dockerfile
```

Para visualizar a imagem foi criada, utilize o comando abaixo
```bash
docker image ls
```
O retorno da comando deve ser algo como o exemplo abaixo.
 Note que o tamanho de nossa imagem é um pouco maior que o da imagem padrão.
```bash
minha-aplicacao	    v1              e0d43b83c8ff    1 mnute ago 50.7MB
python              3.10.0-alpine   3a16a76a1963    3 days ago  45.4MB
``` 

## Criando o container

Já criamos nossa imagem, então estamos prontos para executarmos o container, para isto, utilize o comando abaixo 
```bash
docker container run -d --rm --name myapp -p 5000:5000 minha-aplicacao:v1
``` 
Podemos verificar se o contêiner está em sendo executado com o comando 
```bash
docker container ls -a
``` 


<a name="testando_aplicacao"></a>
## Testando a aplicação

Se você seguiu as instruções acima, a aplicação pode ser acessada no em <a href="http://localhost:5000" target="_blank">http://localhost:5000</a>. Mas se voçê quer apenas testar a aplicação, baixe o arquivo <a href="https://github.com/rogeriostos/conversao-distancia/blob/main/start.sh" target="_blank">start.sh</a> e de permissão de execução em sua máquina com o comando 
```bash
chmod +x start.sh 
```
E o execute com o comando 
```bash
sh ./start.sh
```
Isto irá baixar a imagem da aplicação para sua maquina e executar o contêiner. Agora é só testar a aplicação em <a href="http://localhost:5000" target="_blank">http://localhost:5000</a>
