# Rotas para cadastro, login e painel
@app.route ('/')
def home ():
    return send_from_directory('../', 'index.html')
