
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3, os

app = Flask(__name__)
CORS(app)

DB = 'database/dogvader.db'
if not os.path.exists(DB):
    with open("database/schema.sql") as f:
        sql = f.read()
    conn = sqlite3.connect(DB)
    conn.executescript(sql)
    conn.close()

@app.route("/api/cadastrar", methods=["POST"])
def cadastrar():
    data = request.json
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("INSERT INTO tutores (nome, email, senha) VALUES (?, ?, ?)",
                (data["nome"], data["email"], data["senha"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Cadastro realizado!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT id, nome FROM tutores WHERE email=? AND senha=?", (data["email"], data["senha"]))
    row = cur.fetchone()
    conn.close()
    if row:
        return jsonify({"ok": True, "id": row[0], "nome": row[1]})
    return jsonify({"ok": False, "message": "Dados inválidos"})

@app.route("/api/cachorro", methods=["POST"])
def cachorro():
    nome = request.form["nome"]
    foto = request.files["foto"]
    tutor_id = request.form["tutor_id"]
    path = f"frontend/assets/img/{foto.filename}"
    foto.save(path)
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("INSERT INTO cachorros (nome, foto, tutor_id) VALUES (?, ?, ?)", (nome, foto.filename, tutor_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Cachorro cadastrado!"})

avisos = []

@app.route("/api/avisar", methods=["POST"])
def avisar():
    data = request.json
    expira = datetime.now() + timedelta(minutes=30)
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT nome FROM cachorros WHERE tutor_id=?", (data["tutor_id"],))
    nome = cur.fetchone()[0]
    avisos.append({"nome": nome, "tipo": data["tipo"], "expira": expira.strftime("%H:%M")})
    return jsonify({"message": f"Aviso '{data['tipo']}' registrado para {nome}."})

@app.route("/api/equipe")
def equipe():
    return jsonify(avisos)

if __name__ == "__main__":
    app.run(debug=True)
