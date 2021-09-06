from flask import Flask, render_template, request, url_for, redirect, Response, jsonify
import logging

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':  
        return render_template('index.html')
    else:
        selecao = request.form.get('selectTemp')
        valor = request.form.get('valorRef')

        if selecao == '1':
            resultado = float(valor) / 1000
            unidade = "quilômetros"
        else:
            resultado = float(valor) * 1000
            unidade = "metros"
            
        return render_template('index.html', conteudo={'unidade': unidade, 'valor': resultado})

if __name__ == '__main__':
    app.run()
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)