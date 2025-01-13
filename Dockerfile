# Usa a imagem oficial do Python como base
FROM python:3.13.0

# Define o diretório
WORKDIR /app

# Copia o arquivo de requirements
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto do código da aplicação
COPY . .

# Expõe a porta que a aplicação vai usar
EXPOSE 5000

# Comando para rodar a aplicação usando gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]