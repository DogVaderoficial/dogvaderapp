
const app = document.getElementById("app");

function telaLogin() {
  app.innerHTML = `
    <h2>Login</h2>
    <input type="email" id="email" placeholder="Email"><br>
    <input type="password" id="senha" placeholder="Senha"><br>
    <button onclick="login()">Entrar</button>
    <p>Não tem conta? <a href="#" onclick="telaCadastro()">Cadastre-se</a></p>
  `;
}

function telaCadastro() {
  app.innerHTML = `
    <h2>Cadastro</h2>
    <input type="text" id="nome" placeholder="Nome"><br>
    <input type="email" id="email" placeholder="Email"><br>
    <input type="password" id="senha" placeholder="Senha"><br>
    <button onclick="cadastrar()">Cadastrar</button>
    <p>Já tem conta? <a href="#" onclick="telaLogin()">Login</a></p>
  `;
}

function painelTutor(nome, id) {
  app.innerHTML = `
    <h2>Olá, ${nome}</h2>
    <h3>Cadastre seu cachorro</h3>
    <input type="text" id="nomeDog" placeholder="Nome do cachorro"><br>
    <input type="file" id="fotoDog"><br>
    <button onclick="cadastrarDog(${id})">Cadastrar</button>
    <h3>Enviar aviso</h3>
    <button onclick="avisar('${id}', 'levar')">Estou indo levar</button>
    <button onclick="avisar('${id}', 'buscar')">Estou indo buscar</button>
  `;
}

function painelEquipe(avisos) {
  app.innerHTML = "<h2>Painel da Equipe</h2>";
  avisos.forEach(a => {
    app.innerHTML += `<p><b>${a.nome}</b>: ${a.tipo} (até ${a.expira})</p>`;
  });
}

function login() {
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, senha: senha.value })
  })
  .then(r => r.json())
  .then(d => d.ok ? painelTutor(d.nome, d.id) : alert(d.message));
}

function cadastrar() {
  fetch("/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value })
  })
  .then(r => r.json())
  .then(d => alert(d.message));
}

function cadastrarDog(tutor_id) {
  const form = new FormData();
  form.append("nome", document.getElementById("nomeDog").value);
  form.append("foto", document.getElementById("fotoDog").files[0]);
  form.append("tutor_id", tutor_id);
  fetch("/api/cachorro", { method: "POST", body: form })
    .then(r => r.json())
    .then(d => alert(d.message));
}

function avisar(tutor_id, tipo) {
  fetch("/api/avisar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tutor_id, tipo })
  })
  .then(r => r.json())
  .then(d => alert(d.message));
}

window.onload = telaLogin;
