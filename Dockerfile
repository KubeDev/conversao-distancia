FROM python:3.10.0-alpine
# como usuário root
# cria o usuário appuser
RUN adduser -D appuser
# cd ~/appuser/
WORKDIR /home/appuser
# cria na pasta do usuário, a pasta que irá acomodar as dependencias do app
RUN mkdir -p ./.local/bin && chown -R appuser:appuser ./.local
# adiciona a pasta de dependencias na PATH
ENV PATH="/home/appuser/.local/bin:${PATH}"

# como usuário appuser
USER appuser
COPY requirements.txt .
# instala as dependencias do app
RUN pip3 install --user -r ./requirements.txt
COPY  . .
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]