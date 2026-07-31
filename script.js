// ========== VARIÁVEIS DO JOGO ==========
let perguntasFeitas = 0;
let acertos = 0;
let respostaCorreta = 0;
const totalPerguntas = 10;

// Elementos
const foguete = document.getElementById('foguete');
const barra = document.getElementById('barra');
const contador = document.getElementById('contador');
const pontosEl = document.getElementById('pontos');
const perguntaEl = document.getElementById('pergunta');
const respostaEl = document.getElementById('resposta');
const feedbackEl = document.getElementById('feedback');
const resultadoEl = document.getElementById('resultado');
const btnComecar = document.getElementById('btnComecar');
const btnResposta = document.getElementById('btnResposta');

// ========== FUNÇÃO: GERAR CONTA ALEATÓRIA ==========
function gerarConta() {
    const operacao = Math.floor(Math.random() * 3); // 0=soma, 1=subtração, 2=multiplicação
    let a, b, contaTexto;

    if (operacao === 0) {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        respostaCorreta = a + b;
        contaTexto = `${a} + ${b} = ?`;
    } else if (operacao === 1) {
        a = Math.floor(Math.random() * 50) + 20;
        b = Math.floor(Math.random() * a);
        respostaCorreta = a - b;
        contaTexto = `${a} − ${b} = ?`;
    } else {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        respostaCorreta = a * b;
        contaTexto = `${a} × ${b} = ?`;
    }

    perguntaEl.textContent = contaTexto;
    respostaEl.value = '';
    feedbackEl.textContent = '';
}

// ========== FUNÇÃO: INICIAR JOGO ==========
function iniciarJogo() {
    perguntasFeitas = 0;
    acertos = 0;
    atualizarInterface();
    foguete.style.bottom = '10px';
    resultadoEl.style.display = 'none';
    btnComecar.style.display = 'none';
    btnResposta.style.display = 'inline-block';
    gerarConta();
}

// ========== FUNÇÃO: VERIFICAR RESPOSTA ==========
function verificarResposta() {
    const respostaUsuario = parseInt(respostaEl.value);
    if (isNaN(respostaUsuario)) {
        feedbackEl.textContent = '⚠️ Digite um número!';
        feedbackEl.style.color = '#ffd700';
        return;
    }

    perguntasFeitas++;

    if (respostaUsuario === respostaCorreta) {
        acertos++;
        feedbackEl.textContent = '✅ Correto! O foguete subiu!';
        feedbackEl.style.color = '#00ff88';
        subirFoguete();
    } else {
        feedbackEl.textContent = `❌ Errou! Resposta certa: ${respostaCorreta}`;
        feedbackEl.style.color = '#ff6464';
    }

    atualizarInterface();

    if (perguntasFeitas === totalPerguntas) {
        setTimeout(mostrarResultado, 800);
    } else {
        setTimeout(gerarConta, 1200);
    }
}

// ========== FUNÇÃO: SUBIR FOGUETE ==========
function subirFoguete() {
    foguete.classList.add('subindo');
    const alturaAtual = parseFloat(getComputedStyle(foguete).bottom) || 10;
    const novaAltura = alturaAtual + (190 / totalPerguntas);
    foguete.style.bottom = novaAltura + 'px';
    setTimeout(() => foguete.classList.remove('subindo'), 300);
}

// ========== ATUALIZAR BARRA E PONTOS ==========
function atualizarInterface() {
    const porcentagem = (perguntasFeitas / totalPerguntas) * 100;
    barra.style.width = porcentagem + '%';
    contador.textContent = `${perguntasFeitas} / ${totalPerguntas}`;
    pontosEl.textContent = acertos;
}

// ========== MOSTRAR RESULTADO FINAL ==========
function mostrarResultado() {
    perguntaEl.textContent = '';
    feedbackEl.textContent = '';
    btnResposta.style.display = 'none';

    if (acertos >= 7) {
        resultadoEl.className = 'resultado sucesso';
        resultadoEl.innerHTML = `
            <h3>🎉 Parabéns! Missão Cumprida! 🎉</h3>
            <p>Você acertou ${acertos} de ${totalPerguntas} questões!</p>
            <p>Assim como Katherine Johnson, você usou a matemática para ajudar em uma missão espacial!</p>
            <button class="btn" onclick="iniciarJogo()">🔄 Jogar Novamente</button>
        `;
        // Foguete chega ao topo
        foguete.style.bottom = '210px';
    } else {
        resultadoEl.className = 'resultado tente';
        resultadoEl.innerHTML = `
            <h3>🚀 Quase lá! Tente de novo!</h3>
            <p>Você acertou ${acertos} de ${totalPerguntas} questões.</p>
            <p>Precisa de pelo menos 7 acertos para chegar ao espaço! Estude mais e tente novamente.</p>
            <button class="btn" onclick="iniciarJogo()">🔄 Tentar Novamente</button>
        `;
    }
}

// ========== BOTÃO VOLTAR AO TOPO ==========
const btnTopo = document.getElementById('btnTopo');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        btnTopo.style.display = 'block';
    } else {
        btnTopo.style.display = 'none';
    }
});

function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== PERMITIR ENVIAR COM TECLA ENTER ==========
respostaEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && btnComecar.style.display !== 'inline-block') {
        verificarResposta();
    }
});
