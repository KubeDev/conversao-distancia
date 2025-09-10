from flask import Flask, render_template, request, jsonify
import logging
import socket  # Módulo para obter informações do servidor

app = Flask(__name__,
            static_url_path='/static', 
            static_folder='static',
            template_folder='templates')

@app.route('/', methods=['GET', 'POST'])
def index():
    # Obter informações do servidor
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)

    if request.method == 'GET':  
        return render_template('index.html', hostname=hostname, ip_address=ip_address)
    else:
        selecao = request.form.get('selectTemp')
        valor = request.form.get('valorRef')

        try:
            valor = float(valor)
        except ValueError:
            return render_template('index.html', conteudo={'unidade': 'inválido', 'valor': 'Entrada inválida'}, hostname=hostname, ip_address=ip_address)

        # Dicionário de conversões com fatores de multiplicação e unidades
        conversoes = {
            '1': {'fator': 1/1000, 'unidade': 'quilômetros'},  # Metro -> Quilômetros
            '2': {'fator': 1000, 'unidade': 'metros'},         # Quilômetros -> Metro
            '3': {'fator': 1/1609.34, 'unidade': 'milhas'},   # Metro -> Milhas
            '4': {'fator': 1609.34, 'unidade': 'metros'},     # Milhas -> Metro
            '5': {'fator': 3.28084, 'unidade': 'pés'},        # Metro -> Pés
            '6': {'fator': 1/3.28084, 'unidade': 'metros'},   # Pés -> Metro
            '7': {'fator': 1/100, 'unidade': 'metros'},       # Centímetros -> Metro
            '8': {'fator': 100, 'unidade': 'centímetros'},    # Metro -> Centímetros
            '9': {'fator': 2.54, 'unidade': 'centímetros'},   # Polegadas -> Centímetros
            '10': {'fator': 1/2.54, 'unidade': 'polegadas'}, # Centímetros -> Polegadas
            '11': {'fator': 0.9144, 'unidade': 'metros'},     # Jardas -> Metro
            '12': {'fator': 1/0.9144, 'unidade': 'jardas'},   # Metro -> Jardas
        }

        # Lógica de conversão usando o dicionário
        if selecao in conversoes:
            conversao = conversoes[selecao]
            resultado = valor * conversao['fator']
            unidade = conversao['unidade']
        else:
            resultado = "Inválido"
            unidade = ""

        return render_template('index.html', conteudo={'unidade': unidade, 'valor': resultado}, hostname=hostname, ip_address=ip_address)

@app.route('/convert-api', methods=['POST'])
def convert_api():
    """Endpoint API para conversões via AJAX"""
    try:
        data = request.get_json()
        selecao = data.get('conversion_type')
        valor = data.get('value')
        
        # Validar entrada
        if not selecao or valor is None:
            return jsonify({'error': 'Dados inválidos'}), 400
            
        try:
            valor = float(valor)
        except (ValueError, TypeError):
            return jsonify({'error': 'Valor deve ser um número'}), 400
        
        # Dicionário de conversões (mesmo do endpoint principal)
        conversoes = {
            '1': {'fator': 1/1000, 'unidade': 'quilômetros'},  # Metro -> Quilômetros
            '2': {'fator': 1000, 'unidade': 'metros'},         # Quilômetros -> Metro
            '3': {'fator': 1/1609.34, 'unidade': 'milhas'},   # Metro -> Milhas
            '4': {'fator': 1609.34, 'unidade': 'metros'},     # Milhas -> Metro
            '5': {'fator': 3.28084, 'unidade': 'pés'},        # Metro -> Pés
            '6': {'fator': 1/3.28084, 'unidade': 'metros'},   # Pés -> Metro
            '7': {'fator': 1/100, 'unidade': 'metros'},       # Centímetros -> Metro
            '8': {'fator': 100, 'unidade': 'centímetros'},    # Metro -> Centímetros
            '9': {'fator': 2.54, 'unidade': 'centímetros'},   # Polegadas -> Centímetros
            '10': {'fator': 1/2.54, 'unidade': 'polegadas'}, # Centímetros -> Polegadas
            '11': {'fator': 0.9144, 'unidade': 'metros'},     # Jardas -> Metro
            '12': {'fator': 1/0.9144, 'unidade': 'jardas'},   # Metro -> Jardas
        }
        
        # Realizar conversão
        if selecao in conversoes:
            conversao = conversoes[selecao]
            resultado = valor * conversao['fator']
            unidade = conversao['unidade']
            
            return jsonify({
                'success': True,
                'result': resultado,
                'unit': unidade,
                'original_value': valor
            })
        else:
            return jsonify({'error': 'Tipo de conversão inválido'}), 400
            
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    app.run()
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
