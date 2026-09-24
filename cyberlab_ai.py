#!/usr/bin/env python3
"""
CYBERLAB AI
Servidor Python simples para o laboratório educacional de cibersegurança.

Execute:
    python3 cyberlab_ai.py

Depois abra:
    http://127.0.0.1:8000

Observação:
Este servidor é uma demo local. Ele não executa comandos recebidos pelo usuário
nem fornece acesso a sistemas externos.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse
import json

HOST = "127.0.0.1"
PORT = 8000

HTML = r"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CYBERLAB_AI</title>
<style>
:root{--bg:#070a12;--panel:#10172a;--text:#edf2ff;--muted:#8995b2;--line:#26314a;--purple:#9b6cff;--green:#58f0c2}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 80% 0,#20113e,transparent 35%),var(--bg);color:var(--text);font-family:system-ui,sans-serif}
header{height:70px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 6%;gap:25px;background:#070a12ee;position:sticky;top:0}
.logo{font-weight:900;letter-spacing:.08em}.logo span{color:var(--purple)}
nav{margin-left:auto;display:flex;gap:20px}nav a{color:var(--muted);text-decoration:none}
main{max-width:1100px;margin:auto;padding:60px 20px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:35px;align-items:center;min-height:450px}
h1{font-size:clamp(3rem,7vw,6rem);line-height:.92;margin:15px 0;letter-spacing:-.06em}h1 span{color:var(--purple)}
.eyebrow{color:var(--green);font:700 12px monospace;letter-spacing:.18em}.lead{color:var(--muted);font-size:1.1rem}
.terminal,.chat{border:1px solid var(--line);border-radius:15px;background:var(--panel);overflow:hidden;box-shadow:0 20px 70px #0006}
.term-head{padding:13px;border-bottom:1px solid var(--line);color:var(--muted);font:12px monospace}
pre{padding:22px;color:#b9c6e7;line-height:1.8;overflow:auto}.green{color:var(--green)}
section{padding:70px 0}.title{font-size:2.7rem;margin-top:5px}
.messages{height:320px;overflow:auto;padding:18px}.msg{padding:12px 15px;border-radius:10px;margin:10px 0;max-width:85%;background:#171f34;border:1px solid var(--line)}.user{margin-left:auto;background:#281d43}
form{border-top:1px solid var(--line);padding:15px}textarea{width:100%;background:#080d18;color:var(--text);border:1px solid var(--line);border-radius:9px;padding:12px;resize:vertical;min-height:80px}
button{border:1px solid var(--line);border-radius:9px;padding:11px 17px;background:var(--purple);color:white;font-weight:800;cursor:pointer;margin-top:10px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.card{background:var(--panel);border:1px solid var(--line);border-radius:13px;padding:20px}.card p{color:var(--muted)}
@media(max-width:800px){.hero{grid-template-columns:1fr}.cards{grid-template-columns:1fr 1fr}nav{display:none}}
@media(max-width:500px){.cards{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
<div class="logo">CYBERLAB<span>_AI</span></div>
<nav><a href="#ia">IA</a><a href="#labs">Labs</a><a href="#sobre">Sobre</a></nav>
</header>

<main>
<section class="hero">
<div>
<p class="eyebrow">SECURITY • LINUX • CTF • BLUE TEAM</p>
<h1>CYBER<br><span>LAB_AI</span></h1>
<p class="lead">Laboratório educacional para estudar Linux, redes, segurança web, Python e CTFs.</p>
</div>
<div class="terminal">
<div class="term-head">cyberlab@localhost:~</div>
<pre>$ python3 cyberlab_ai.py
<span class="green">● CYBERLAB_AI online</span>
Mode: educational
Network: local
Modules: Linux | Web | CTF | Blue Team

$ echo "ready"
<span class="green">ready_</span></pre>
</div>
</section>

<section id="ia">
<p class="eyebrow">AI CONSOLE</p>
<h2 class="title">Assistente</h2>
<div class="chat">
<div id="messages" class="messages">
<div class="msg"><b>CYBERLAB_AI</b><br>Olá! Pergunte sobre Linux, redes, HTTP, Python, CTF ou defesa.</div>
</div>
<form id="form">
<textarea id="question" maxlength="2000" placeholder="Digite sua pergunta..." required></textarea>
<button type="submit">Enviar</button>
</form>
</div>
</section>

<section id="labs">
<p class="eyebrow">TRAINING</p>
<h2 class="title">Labs</h2>
<div class="cards">
<div class="card"><h3>Linux</h3><p>Processos, permissões, SSH, Bash e logs.</p></div>
<div class="card"><h3>Web</h3><p>HTTP, XSS, SQLi, sessões e defesa.</p></div>
<div class="card"><h3>CTF</h3><p>Desafios em ambientes autorizados.</p></div>
<div class="card"><h3>Blue Team</h3><p>Hardening, logs e detecção.</p></div>
</div>
</section>

<section id="sobre">
<p class="eyebrow">PROJECT</p>
<h2 class="title">Sobre</h2>
<p class="lead">Aplicação Python local para estudos de cibersegurança. O servidor não executa comandos enviados pelo usuário.</p>
</section>
</main>

<script>
const form=document.getElementById("form");
const question=document.getElementById("question");
const messages=document.getElementById("messages");

function add(text, cls){
    const d=document.createElement("div");
    d.className="msg "+cls;
    d.textContent=text;
    messages.appendChild(d);
    messages.scrollTop=messages.scrollHeight;
}

function answer(q){
    const s=q.toLowerCase();

    if(s.includes("linux"))
        return "Linux: estude permissões, processos, serviços, SSH, Bash e logs em uma máquina própria ou laboratório.";

    if(s.includes("sql"))
        return "SQL injection ocorre quando entrada não confiável altera uma consulta SQL. Em laboratório, estude prepared statements, validação e escaping.";

    if(s.includes("xss"))
        return "XSS envolve conteúdo controlado pelo usuário sendo interpretado pelo navegador. Estude escaping, validação e Content Security Policy.";

    if(s.includes("nmap"))
        return "Nmap é usado para descoberta e auditoria de rede. Use somente contra máquinas próprias ou explicitamente autorizadas.";

    if(s.includes("ctf"))
        return "Em CTFs, pratique reconhecimento, enumeração, análise, exploração autorizada e documentação.";

    return "Posso explicar esse assunto de forma educacional. Tente perguntar sobre Linux, redes, Python, Web Security, CTF ou Blue Team.";
}

form.addEventListener("submit", async (event)=>{
    event.preventDefault();

    const q=question.value.trim();
    if(!q)return;

    add(q,"user");
    question.value="";

    try{
        const response=await fetch("/api/chat",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({question:q})
        });

        const data=await response.json();
        add(data.answer,"");
    }catch(error){
        add("Erro ao conectar ao servidor Python.","");
    }
});
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/":
            body = HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/health":
            self.send_json({"status": "ok", "service": "CYBERLAB_AI"})
            return

        self.send_json({"error": "Página não encontrada"}, 404)

    def do_POST(self):
        path = urlparse(self.path).path

        if path != "/api/chat":
            self.send_json({"error": "Endpoint não encontrado"}, 404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 10000:
                self.send_json({"error": "Requisição muito grande"}, 413)
                return

            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
            question = str(data.get("question", "")).strip()

            if not question:
                self.send_json({"error": "Pergunta vazia"}, 400)
                return

            if len(question) > 2000:
                self.send_json({"error": "Pergunta muito longa"}, 400)
                return

            # Não executa comandos enviados pelo usuário.
            answer = self.make_answer(question)
            self.send_json({"answer": answer})

        except (ValueError, json.JSONDecodeError, UnicodeDecodeError):
            self.send_json({"error": "JSON inválido"}, 400)

    @staticmethod
    def make_answer(question):
        q = question.lower()

        if "linux" in q:
            return "Linux: estude permissões, processos, serviços, SSH, Bash e logs em uma máquina própria ou laboratório."
        if "sql" in q:
            return "SQL injection ocorre quando entrada não confiável altera uma consulta SQL. Em laboratório, estude prepared statements, validação e escaping."
        if "xss" in q:
            return "XSS envolve conteúdo controlado pelo usuário sendo interpretado pelo navegador. Estude escaping, validação e Content Security Policy."
        if "nmap" in q:
            return "Nmap é usado para descoberta e auditoria de rede. Use somente contra máquinas próprias ou explicitamente autorizadas."
        if "ctf" in q:
            return "Em CTFs, pratique reconhecimento, enumeração, análise, exploração autorizada e documentação."

        return "Posso explicar esse assunto de forma educacional. Tente perguntar sobre Linux, redes, Python, Web Security, CTF ou Blue Team."


def main():
    server = HTTPServer((HOST, PORT), Handler)
    print("=" * 50)
    print(" CYBERLAB_AI")
    print("=" * 50)
    print(f"Servidor: http://{HOST}:{PORT}")
    print("Pressione Ctrl+C para parar.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
