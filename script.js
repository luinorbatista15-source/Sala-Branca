let modoAtual = "";
let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let pontos = 0;
let tentativas = 0;
let paresEncontrados = 0;

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar(array) {
    return array.sort(() => Math.random() - 0.5);
}

function contaFacil() {
    const tipo = numeroAleatorio(1, 4);
    let a, b, resultado, texto;

    if (tipo === 1) {
        a = numeroAleatorio(1, 50);
        b = numeroAleatorio(1, 50);
        resultado = a + b;
        texto = `${a} + ${b}`;
    } else if (tipo === 2) {
        a = numeroAleatorio(20, 80);
        b = numeroAleatorio(1, a);
        resultado = a - b;
        texto = `${a} - ${b}`;
    } else if (tipo === 3) {
        a = numeroAleatorio(2, 12);
        b = numeroAleatorio(2, 12);
        resultado = a * b;
        texto = `${a} × ${b}`;
    } else {
        b = numeroAleatorio(2, 12);
        resultado = numeroAleatorio(2, 12);
        a = b * resultado;
        texto = `${a} ÷ ${b}`;
    }

    return { pergunta: texto, resposta: resultado.toString() };
}

function contaMedio() {
    const tipo = numeroAleatorio(1, 5);
    let a, b, c, resultado, texto;

    if (tipo === 1) {
        a = numeroAleatorio(2, 6);
        b = numeroAleatorio(2, 10);
        c = numeroAleatorio(2, 6);
        resultado = Math.pow(a, 2) + b * c;
        texto = `${a}² + ${b} × ${c}`;
    } else if (tipo === 2) {
        a = numeroAleatorio(2, 8);
        b = numeroAleatorio(2, 10);
        c = numeroAleatorio(1, 20);
        resultado = a * b + c;
        texto = `${a} × ${b} + ${c}`;
    } else if (tipo === 3) {
        a = numeroAleatorio(2, 8);
        b = numeroAleatorio(2, 5);
        c = numeroAleatorio(1, 15);
        resultado = Math.pow(a, 2) - b * c;
        texto = `${a}² - ${b} × ${c}`;
    } else if (tipo === 4) {
        a = numeroAleatorio(2, 8);
        b = numeroAleatorio(1, 10);
        c = numeroAleatorio(1, 10);
        resultado = a * (b + c);
        texto = `${a} × (${b} + ${c})`;
    } else {
        a = numeroAleatorio(2, 5);
        b = numeroAleatorio(2, 6);
        c = numeroAleatorio(1, 10);
        resultado = Math.pow(a, 2) + b * c - 2;
        texto = `${a}² + ${b} × ${c} - 2`;
    }

    return { pergunta: texto, resposta: resultado.toString() };
}

function contaDificil() {
    const tipo = numeroAleatorio(1, 3);

    if (tipo === 1) {
        const x = numeroAleatorio(2, 12);
        const a = numeroAleatorio(2, 8);
        const b = numeroAleatorio(1, 20);
        const resultado = a * x + b;

        return {
            pergunta: `${a}x + ${b} = ${resultado}`,
            resposta: `x = ${x}`
        };
    }

    if (tipo === 2) {
        const x1 = numeroAleatorio(1, 8);
        const x2 = numeroAleatorio(1, 8);
        const b = -(x1 + x2);
        const c = x1 * x2;
        const texto = b >= 0
            ? `x² + ${b}x + ${c} = 0`
            : `x² - ${Math.abs(b)}x + ${c} = 0`;

        return {
            pergunta: texto,
            resposta: `x = ${x1} e ${x2}`
        };
    }

    const a = numeroAleatorio(1, 8);
    const b = numeroAleatorio(1, 15);
    const x = numeroAleatorio(1, 10);
    const resultado = a * x + b;

    return {
        pergunta: `f(x) = ${a}x + ${b} | x = ${x}`,
        resposta: `f(${x}) = ${resultado}`
    };
}

function criarCartas() {
    const pares = [];

    for (let i = 0; i < 6; i++) {
        let conta;

        if (modoAtual === "facil") conta = contaFacil();
        if (modoAtual === "medio") conta = contaMedio();
        if (modoAtual === "dificil") conta = contaDificil();

        pares.push({ id: i, tipo: "pergunta", texto: conta.pergunta });
        pares.push({ id: i, tipo: "resposta", texto: conta.resposta });
    }

    cartas = embaralhar(pares);
    mostrarCartas();
}

function mostrarCartas() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";

    cartas.forEach((carta, index) => {
        const elemento = document.createElement("div");
        elemento.classList.add("carta");
        elemento.setAttribute("role", "button");
        elemento.setAttribute("tabindex", "0");
        elemento.setAttribute("aria-label", "Carta fechada");

        elemento.innerHTML = `
            <div class="carta-interna">
                <div class="frente">?</div>
                <div class="verso">${carta.texto}</div>
            </div>
        `;

        elemento.onclick = () => virarCarta(elemento, index);
        elemento.onkeydown = evento => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                virarCarta(elemento, index);
            }
        };

        tabuleiro.appendChild(elemento);
    });
}

function virarCarta(elemento, index) {
    if (bloqueado) return;
    if (elemento.classList.contains("virada")) return;
    if (elemento.classList.contains("encontrada")) return;
    if (primeiraCarta && primeiraCarta.index === index) return;

    elemento.classList.add("virada");
    elemento.setAttribute("aria-label", cartas[index].texto);

    if (!primeiraCarta) {
        primeiraCarta = { elemento, index, carta: cartas[index] };
        return;
    }

    segundaCarta = { elemento, index, carta: cartas[index] };
    tentativas++;
    document.getElementById("tentativas").textContent = tentativas;
    verificarPar();
}

function verificarPar() {
    bloqueado = true;

    const mesmaConta = primeiraCarta.carta.id === segundaCarta.carta.id;
    const tiposDiferentes = primeiraCarta.carta.tipo !== segundaCarta.carta.tipo;

    if (mesmaConta && tiposDiferentes) {
        primeiraCarta.elemento.classList.add("encontrada");
        segundaCarta.elemento.classList.add("encontrada");
        primeiraCarta.elemento.setAttribute("aria-label", "Par encontrado");
        segundaCarta.elemento.setAttribute("aria-label", "Par encontrado");

        pontos += 100;
        paresEncontrados++;
        document.getElementById("pontos").textContent = pontos;
        document.getElementById("mensagem").textContent = "✅ Par encontrado!";

        primeiraCarta = null;
        segundaCarta = null;
        bloqueado = false;

        if (paresEncontrados === 6) {
            setTimeout(() => {
                alert(`🎉 Parabéns!\n\nVocê completou o jogo!\nPontuação: ${pontos}\nTentativas: ${tentativas}`);
            }, 500);
        }
    } else {
        pontos = Math.max(0, pontos - 10);
        document.getElementById("pontos").textContent = pontos;
        document.getElementById("mensagem").textContent = "❌ Não é um par. Tente novamente!";

        setTimeout(() => {
            primeiraCarta.elemento.classList.remove("virada");
            segundaCarta.elemento.classList.remove("virada");
            primeiraCarta.elemento.setAttribute("aria-label", "Carta fechada");
            segundaCarta.elemento.setAttribute("aria-label", "Carta fechada");
            primeiraCarta = null;
            segundaCarta = null;
            bloqueado = false;
            document.getElementById("mensagem").textContent = "Encontre os pares!";
        }, 900);
    }
}

function iniciarJogo(modo) {
    modoAtual = modo;
    document.getElementById("inicio").classList.remove("ativa");
    document.getElementById("jogo").classList.add("ativa");

    pontos = 0;
    tentativas = 0;
    paresEncontrados = 0;
    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;

    document.getElementById("pontos").textContent = "0";
    document.getElementById("tentativas").textContent = "0";

    const titulos = {
        facil: "🟢 Modo Fácil",
        medio: "🟡 Modo Médio",
        dificil: "🔴 Modo Difícil"
    };

    document.getElementById("tituloModo").textContent = titulos[modo];
    document.getElementById("mensagem").textContent = "Encontre os pares!";
    criarCartas();
}

function reiniciarJogo() {
    if (!modoAtual) return iniciarJogo("facil");
    iniciarJogo(modoAtual);
}

function voltarInicio() {
    document.getElementById("jogo").classList.remove("ativa");
    document.getElementById("inicio").classList.add("ativa");
}
