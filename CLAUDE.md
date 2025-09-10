# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Arquitetura da Aplicação

Esta é uma aplicação web Flask simples para conversão de distâncias. A estrutura é:

- **src/main.py**: Aplicação principal Flask com rota única que renderiza um formulário de conversão
- **src/templates/index.html**: Template HTML com Bootstrap para interface de conversão
- **src/requirements.txt**: Dependências Python (Flask 2.0.1, Gunicorn 20.1.0)

### Funcionalidades Implementadas
- Conversões de distância: metros ↔ quilômetros, metros ↔ milhas, metros ↔ pés
- Interface web responsiva com Bootstrap 5.1
- Tratamento de erros para entradas inválidas
- Exibição de informações do servidor (hostname e IP)

## Comandos de Desenvolvimento

### Executar a aplicação localmente:
```bash
cd src
python -m pip install -r requirements.txt
python main.py
```

### Executar com Gunicorn (produção):
```bash
cd src
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## Estrutura do Projeto

- O ponto de entrada é `src/main.py`
- Templates ficam em `src/templates/`
- A aplicação está configurada para usar Gunicorn em produção
- Utiliza logging integrado com Gunicorn quando executado como WSGI

## Lógica de Conversão

As conversões são implementadas com valores de conversão fixos:
- Metro para quilômetro: divide por 1000
- Metro para milha: divide por 1609.34
- Metro para pé: multiplica por 3.28084