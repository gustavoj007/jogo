// Caça-palavras de Arquitetura Computacional (tema endurance)
// Banco com os termos guardados no código. A cada partida o jogo sorteia 15 deles e os divide
// em 3 fases de 5 palavras, sem repetir termo entre as fases. Em cada fase as palavras também
// mudam de lugar e de direção no tabuleiro.

/* ---------- banco de termos (16 guardados; 15 são sorteados por partida) ---------- */
const TERMOS = [
  { resposta: 'CPU', pista: 'Componente que busca, decodifica e executa as instruções dos programas.' },
  { resposta: 'ULA', pista: 'Parte da CPU que faz as contas e as operações lógicas.' },
  { resposta: 'UC', pista: 'Parte do processador que coordena e comanda o trabalho dos demais componentes.' },
  { resposta: 'REGISTRADORES', pista: 'Minúsculos espaços dentro da CPU, os mais velozes, que guardam o dado em uso.' },
  { resposta: 'RAM', pista: 'Memória principal e volátil, onde ficam programas e dados em uso.' },
  { resposta: 'ROM', pista: 'Memória não volátil gravada na fabricação, cujo conteúdo o usuário não altera.' },
  { resposta: 'EEPROM', pista: 'Memória não volátil que pode ser apagada e regravada eletricamente, byte a byte.' },
  { resposta: 'FLASH', pista: 'Memória não volátil regravável, apagada em blocos, usada em pen drives e SSDs.' },
  { resposta: 'CACHE', pista: 'Memória pequena e veloz que guarda cópias de dados muito usados perto da CPU.' },
  { resposta: 'MEMORIADEMASSA', pista: 'Guarda arquivos e programas de forma permanente e em grande volume, como HD ou SSD.' },
  { resposta: 'DMA', pista: 'Mecanismo que move dados entre periféricos e a RAM sem ocupar a CPU.' },
  { resposta: 'ADDRESSBUS', pista: 'Via de mão única pela qual a CPU informa qual posição de memória acessar.' },
  { resposta: 'DATABUS', pista: 'Caminho bidirecional que transporta o conteúdo trocado entre CPU, memória e periféricos.' },
  { resposta: 'MICROCONTROLADOR', pista: 'Chip único que reúne processador, memória e portas de entrada e saída, comum no Arduino.' },
  { resposta: 'DUALCORE', pista: 'Processador com um par de núcleos de execução no mesmo chip.' },
  { resposta: 'QUADCORE', pista: 'Processador com quatro núcleos de execução no mesmo chip.' }
];

/* ---------- direções [passo na linha, passo na coluna] ---------- */
const DIR = {
  D: [0, 1],    // →
  B: [1, 0],    // ↓
  DB: [1, 1],   // ↘
  E: [0, -1],   // ←
  C: [-1, 0],   // ↑
  CE: [-1, -1], // ↖
  BE: [1, -1],  // ↙
  CD: [-1, 1]   // ↗
};
const TODAS_DIRECOES = Object.values(DIR);
const SETA = { '0,1': '→', '1,0': '↓', '1,1': '↘', '0,-1': '←', '-1,0': '↑', '-1,-1': '↖', '1,-1': '↙', '-1,1': '↗' };
const NOME_DIRECAO = {
  '0,1': 'para a direita (→)',
  '1,0': 'para baixo (↓)',
  '1,1': 'na diagonal, para baixo e para a direita (↘)',
  '0,-1': 'para a esquerda (←)',
  '-1,0': 'para cima (↑)',
  '-1,-1': 'na diagonal, para cima e para a esquerda (↖)',
  '1,-1': 'na diagonal, para baixo e para a esquerda (↙)',
  '-1,1': 'na diagonal, para cima e para a direita (↗)'
};

/* ---------- as 3 fases ---------- */
const PALAVRAS_POR_FASE = 5;
const FASES = [
  { nome: 'Qualificação', tam: 12,
    dirs: [DIR.D, DIR.B],
    inicial: true, dicaDirecao: true, letras: 'alfabeto' },
  { nome: 'Corrida', tam: 14,
    dirs: [DIR.D, DIR.B, DIR.DB, DIR.E],
    inicial: true, dicaDirecao: true, letras: 'misto' },
  { nome: '24 Horas', tam: 16,
    dirs: TODAS_DIRECOES,
    inicial: false, dicaDirecao: false, letras: 'termos' }
];

// Sorteia 15 termos do banco e divide em grupos de 5 (nenhum termo se repete).
function sortearPartida() {
  const sorteados = embaralhar(TERMOS.map(t => t.resposta)).slice(0, FASES.length * PALAVRAS_POR_FASE);
  return FASES.map((_, i) => sorteados.slice(i * PALAVRAS_POR_FASE, (i + 1) * PALAVRAS_POR_FASE));
}

/* ---------- gerador do tabuleiro ---------- */
function sortear(n) { return Math.floor(Math.random() * n); }

function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = sortear(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function criarSorteioDeLetras(nivel) {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const dosTermos = nivel.termos.join('');
  if (nivel.letras === 'alfabeto') return () => alfabeto[sortear(alfabeto.length)];
  if (nivel.letras === 'misto') {
    return () => (Math.random() < 0.5 ? alfabeto[sortear(alfabeto.length)] : dosTermos[sortear(dosTermos.length)]);
  }
  return () => dosTermos[sortear(dosTermos.length)]; // 'termos': letras que aparecem nas próprias palavras
}

// Evita que apareçam por acaso, em letras sorteadas, sequências iguais aos termos.
function removerOcorrenciasExtras(grade, n, termos, fixas, sortearLetra) {
  for (let rodada = 0; rodada < 3000; rodada++) {
    let mudou = false;
    for (const w of termos) {
      for (const [dl, dc] of TODAS_DIRECOES) {
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            const fr = r + dl * (w.length - 1);
            const fc = c + dc * (w.length - 1);
            if (fr < 0 || fr >= n || fc < 0 || fc >= n) continue;
            let igual = true;
            const livres = [];
            for (let i = 0; i < w.length; i++) {
              const rr = r + dl * i;
              const cc = c + dc * i;
              if (grade[rr][cc] !== w[i]) { igual = false; break; }
              if (!fixas.has(rr + ',' + cc)) livres.push([rr, cc]);
            }
            if (igual && livres.length) {
              const [a, b] = livres[sortear(livres.length)];
              grade[a][b] = sortearLetra();
              mudou = true;
            }
          }
        }
      }
    }
    if (!mudou) return;
  }
}

function gerarTabuleiro(nivel) {
  const n = nivel.tam;
  const ordem = nivel.termos.slice().sort((a, b) => b.length - a.length);
  for (let tentativa = 0; tentativa < 300; tentativa++) {
    const grade = Array.from({ length: n }, () => Array(n).fill(''));
    const colocadas = [];
    let ok = true;

    for (const w of ordem) {
      const opcoes = [];
      for (const [dl, dc] of nivel.dirs) {
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            const fr = r + dl * (w.length - 1);
            const fc = c + dc * (w.length - 1);
            if (fr < 0 || fr >= n || fc < 0 || fc >= n) continue;
            let cruza = 0;
            let cabe = true;
            for (let i = 0; i < w.length; i++) {
              const atual = grade[r + dl * i][c + dc * i];
              if (atual === '') continue;
              if (atual === w[i]) cruza++;
              else { cabe = false; break; }
            }
            if (cabe && cruza < w.length) opcoes.push({ r, c, dl, dc, cruza });
          }
        }
      }
      if (!opcoes.length) { ok = false; break; }
      const comCruzamento = opcoes.filter(o => o.cruza > 0);
      const fonte = comCruzamento.length && Math.random() < 0.5 ? comCruzamento : opcoes;
      const o = fonte[sortear(fonte.length)];
      for (let i = 0; i < w.length; i++) grade[o.r + o.dl * i][o.c + o.dc * i] = w[i];
      colocadas.push({ resposta: w, linha: o.r, coluna: o.c, dl: o.dl, dc: o.dc });
    }
    if (!ok) continue;

    const fixas = new Set();
    grade.forEach((linha, r) => linha.forEach((v, c) => { if (v) fixas.add(r + ',' + c); }));
    const sortearLetra = criarSorteioDeLetras(nivel);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!grade[r][c]) grade[r][c] = sortearLetra();
    removerOcorrenciasExtras(grade, n, nivel.termos, fixas, sortearLetra);
    return { grade, colocadas };
  }
  throw new Error('Não foi possível gerar o tabuleiro.');
}

/* ---------- elementos da página ---------- */
const gradeEl = document.getElementById('grade');
const listaEl = document.getElementById('lista');
const contadorEl = document.getElementById('contador');
const tempoEl = document.getElementById('tempo');
const dicasEl = document.getElementById('dicas');
const nivelEl = document.getElementById('nivel');
const mensagemEl = document.getElementById('mensagem');
const finalEl = document.getElementById('final');
const finalTextoEl = document.getElementById('final-texto');
const btnFinal = document.getElementById('btn-final');

/* ---------- estado ---------- */
let partida = [];         // termos sorteados para cada fase
let nivelAtual = 0;
let cfg = FASES[0];
let tam = cfg.tam;
let cels = [];
let PALAVRAS = [];
let ancora = null;        // primeira casa marcada no modo "toque e toque"
let arrastando = false;
let inicioArrasto = null;
let fimArrasto = null;
let previaAtual = [];
let selecionada = null;   // termo escolhido na lista
let dicaCel = null;
let achadas = 0;
let segundos = 0;         // tempo total da partida
let dicasUsadas = 0;      // dicas da partida inteira
let segundosNoInicioDoNivel = 0;
let dicasNoInicioDoNivel = 0;
let relogio = null;
let focoCel = null;
let acaoFinal = null;

/* ---------- utilidades ---------- */
function celDe(el) {
  const b = el && el.closest ? el.closest('.cel') : null;
  return b ? b.__cel : null;
}

// Caminho em linha reta de a até b (8 direções), ajustado para a direção mais próxima.
function trajeto(a, b) {
  const dr = b.r - a.r;
  const dc = b.c - a.c;
  const ar = Math.abs(dr);
  const ac = Math.abs(dc);
  let sr = Math.sign(dr);
  let sc = Math.sign(dc);
  let n;
  if (ar === 0 && ac === 0) n = 1;
  else if (ar >= 2 * ac) { sc = 0; n = ar + 1; }
  else if (ac >= 2 * ar) { sr = 0; n = ac + 1; }
  else n = Math.max(ar, ac) + 1;
  const saida = [];
  for (let k = 0; k < n; k++) {
    const r = a.r + sr * k;
    const c = a.c + sc * k;
    if (r < 0 || r >= tam || c < 0 || c >= tam) break;
    saida.push(cels[r][c]);
  }
  return saida;
}

function mostrarPrevia(caminho) {
  limparPrevia();
  previaAtual = caminho;
  caminho.forEach(c => c.el.classList.add('previa'));
}
function limparPrevia() {
  previaAtual.forEach(c => c.el.classList.remove('previa'));
  previaAtual = [];
}
function limparAncora() {
  if (ancora) ancora.el.classList.remove('ancora');
  ancora = null;
}
function limparDica() {
  if (dicaCel) dicaCel.el.classList.remove('dica');
  dicaCel = null;
}
function mensagem(texto, tipo) {
  mensagemEl.textContent = texto;
  mensagemEl.className = 'mensagem' + (tipo ? ' ' + tipo : '');
}
function formatarTempo(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
function iniciarRelogio() {
  if (relogio || (PALAVRAS.length && achadas === PALAVRAS.length)) return;
  relogio = setInterval(() => {
    segundos++;
    tempoEl.textContent = formatarTempo(segundos);
  }, 1000);
}
function pararRelogio() {
  clearInterval(relogio);
  relogio = null;
}
function atualizarContador() {
  contadorEl.textContent = achadas + ' de ' + PALAVRAS.length + ' palavras';
}
function rotuloDoTermo(p) {
  return p.resposta.length + ' letras' + (cfg.inicial ? ' · começa com ' + p.resposta[0] : '');
}
function mensagemInicial() {
  const setas = cfg.dirs.map(d => SETA[d[0] + ',' + d[1]]).join(' ');
  const invertidas = cfg.dirs.some(d => d[0] < 0 || d[1] < 0);
  return 'Fase ' + (nivelAtual + 1) + ' (' + cfg.nome + '): arraste da primeira à última letra de um termo, ' +
    'ou toque na primeira e depois na última. Nesta fase as palavras seguem estas direções: ' + setas + '.' +
    (invertidas ? ' Algumas aparecem de trás para frente.' : '');
}

/* ---------- montagem de um nível ---------- */
function iniciarNivel(indice) {
  nivelAtual = indice;
  const termosDaFase = partida[indice];
  cfg = { ...FASES[indice], termos: termosDaFase };
  // o tabuleiro nunca pode ser menor que a maior palavra da fase
  cfg.tam = Math.max(FASES[indice].tam, ...termosDaFase.map(w => w.length));
  cfg.celMax = cfg.tam <= 12 ? 38 : cfg.tam <= 14 ? 36 : 34;
  tam = cfg.tam;

  const { grade, colocadas } = gerarTabuleiro(cfg);
  const pistas = Object.fromEntries(TERMOS.map(t => [t.resposta, t.pista]));
  PALAVRAS = embaralhar(colocadas).map(p => ({ ...p, pista: pistas[p.resposta], achada: false }));

  // estado
  pararRelogio();
  ancora = null; arrastando = false; inicioArrasto = null; fimArrasto = null;
  previaAtual = []; selecionada = null; dicaCel = null; achadas = 0;
  segundosNoInicioDoNivel = segundos;
  dicasNoInicioDoNivel = dicasUsadas;

  // grade
  gradeEl.innerHTML = '';
  gradeEl.style.setProperty('--n', tam);
  gradeEl.style.setProperty('--cel-max', cfg.celMax + 'px');
  cels = [];
  for (let r = 0; r < tam; r++) {
    const linha = [];
    for (let c = 0; c < tam; c++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cel';
      btn.textContent = grade[r][c];
      btn.tabIndex = -1;
      btn.setAttribute('aria-label', 'Letra ' + grade[r][c] + ', linha ' + (r + 1) + ', coluna ' + (c + 1));
      const cel = { r: r, c: c, letra: grade[r][c], el: btn };
      btn.__cel = cel;
      gradeEl.appendChild(btn);
      linha.push(cel);
    }
    cels.push(linha);
  }
  cels[0][0].el.tabIndex = 0;
  focoCel = cels[0][0];

  // lista de termos
  listaEl.innerHTML = '';
  PALAVRAS.forEach(p => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'linha';
    btn.innerHTML = '<span class="pos">—</span><span><span class="titulo-termo"></span><span class="pista-txt"></span></span>';
    p.posEl = btn.querySelector('.pos');
    p.tituloEl = btn.querySelector('.titulo-termo');
    btn.querySelector('.pista-txt').textContent = p.pista;
    p.tituloEl.textContent = rotuloDoTermo(p);
    p.linhaEl = btn;
    btn.addEventListener('click', () => escolherPalavra(p));
    li.appendChild(btn);
    listaEl.appendChild(li);
  });

  // painel
  nivelEl.textContent = (indice + 1) + ' de ' + FASES.length + ' · ' + cfg.nome;
  tempoEl.textContent = formatarTempo(segundos);
  dicasEl.textContent = dicasUsadas;
  finalEl.hidden = true;
  atualizarContador();
  mensagem(mensagemInicial());
}

/* ---------- seleção ---------- */
function finalizar(a, b) {
  const caminho = trajeto(a, b);
  limparPrevia();
  limparAncora();
  iniciarRelogio();
  const texto = caminho.map(c => c.letra).join('');
  const invertido = texto.split('').reverse().join('');
  const p = PALAVRAS.find(x => !x.achada && (x.resposta === texto || x.resposta === invertido));
  if (p) {
    marcarAchada(p, caminho);
  } else {
    caminho.forEach(c => c.el.classList.add('errada'));
    setTimeout(() => caminho.forEach(c => c.el.classList.remove('errada')), 400);
    mensagem('Essa sequência não é um dos termos da lista. Tente de novo: leia as pistas e o número de letras.', 'erro');
  }
}

function tocar(cel) {
  iniciarRelogio();
  if (!ancora) {
    ancora = cel;
    cel.el.classList.add('ancora');
    mensagem('Primeira letra marcada. Agora toque na última letra do termo (Esc cancela).', 'destaque');
  } else if (ancora === cel) {
    limparPrevia();
    limparAncora();
    mensagem(mensagemInicial());
  } else {
    finalizar(ancora, cel);
  }
}

function marcarAchada(p, caminho) {
  p.achada = true;
  p.cor = achadas % 4;
  achadas++;
  caminho.forEach(c => {
    c.el.classList.remove('cor-0', 'cor-1', 'cor-2', 'cor-3');
    c.el.classList.add('achada', 'cor-' + p.cor);
  });
  p.linhaEl.classList.add('achada', 'cor-' + p.cor);
  p.posEl.textContent = 'P' + achadas;
  p.tituloEl.textContent = p.resposta;
  if (dicaCel && dicaCel.r === p.linha && dicaCel.c === p.coluna) limparDica();
  atualizarContador();

  if (achadas < PALAVRAS.length) {
    mensagem('Termo encontrado: ' + p.resposta + '. Faltam ' + (PALAVRAS.length - achadas) + '.', 'sucesso');
    return;
  }

  pararRelogio();
  const tempoNivel = segundos - segundosNoInicioDoNivel;
  const dicasNivel = dicasUsadas - dicasNoInicioDoNivel;
  const plural = n => (n === 1 ? ' dica' : ' dicas');
  if (nivelAtual < FASES.length - 1) {
    mensagem('Fase ' + (nivelAtual + 1) + ' concluída!', 'sucesso');
    finalTextoEl.textContent = 'Fase ' + (nivelAtual + 1) + ' concluída em ' + formatarTempo(tempoNivel) +
      ' com ' + dicasNivel + plural(dicasNivel) + '.';
    btnFinal.textContent = 'Próxima fase';
    acaoFinal = () => iniciarNivel(nivelAtual + 1);
  } else {
    mensagem('Prova completa!', 'sucesso');
    finalTextoEl.textContent = 'Bandeira quadriculada! As ' + FASES.length + ' fases em ' + formatarTempo(segundos) +
      ' com ' + dicasUsadas + plural(dicasUsadas) + ' no total.';
    btnFinal.textContent = 'Jogar de novo';
    acaoFinal = () => reiniciarTudo();
  }
  finalEl.hidden = false;
}

/* ---------- mouse e toque ---------- */
gradeEl.addEventListener('pointerdown', e => {
  const cel = celDe(e.target);
  if (!cel) return;
  e.preventDefault();
  if (ancora) { tocar(cel); return; }
  arrastando = true;
  inicioArrasto = cel;
  fimArrasto = cel;
  mostrarPrevia([cel]);
});

gradeEl.addEventListener('pointermove', e => {
  if (!arrastando) return;
  const cel = celDe(document.elementFromPoint(e.clientX, e.clientY));
  if (!cel) return;
  fimArrasto = cel;
  mostrarPrevia(trajeto(inicioArrasto, cel));
});

window.addEventListener('pointerup', () => {
  if (!arrastando) return;
  arrastando = false;
  if (fimArrasto === inicioArrasto) {
    limparPrevia();
    tocar(inicioArrasto);
  } else {
    const caminho = previaAtual;
    finalizar(caminho[0], caminho[caminho.length - 1]);
  }
});

window.addEventListener('pointercancel', () => {
  arrastando = false;
  limparPrevia();
});

/* ---------- teclado ---------- */
gradeEl.addEventListener('click', e => {
  if (e.detail !== 0) return; // cliques de mouse/toque já foram tratados acima
  const cel = celDe(e.target);
  if (cel) tocar(cel);
});

gradeEl.addEventListener('focusin', e => {
  const cel = celDe(e.target);
  if (!cel) return;
  focoCel.el.tabIndex = -1;
  cel.el.tabIndex = 0;
  focoCel = cel;
  if (ancora && !arrastando) mostrarPrevia(trajeto(ancora, cel));
});

gradeEl.addEventListener('keydown', e => {
  const cel = celDe(e.target);
  if (!cel) return;
  const passos = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
  if (passos[e.key]) {
    e.preventDefault();
    const r = cel.r + passos[e.key][0];
    const c = cel.c + passos[e.key][1];
    if (r >= 0 && r < tam && c >= 0 && c < tam) cels[r][c].el.focus();
  } else if (e.key === 'Escape' && ancora) {
    limparPrevia();
    limparAncora();
    mensagem(mensagemInicial());
  }
});

/* ---------- lista, dica e reinício ---------- */
function escolherPalavra(p) {
  if (selecionada) selecionada.linhaEl.classList.remove('sel');
  selecionada = p;
  p.linhaEl.classList.add('sel');
}

function pedirDica() {
  const alvo = selecionada && !selecionada.achada ? selecionada : PALAVRAS.find(x => !x.achada);
  if (!alvo) return;
  escolherPalavra(alvo);
  limparDica();
  dicaCel = cels[alvo.linha][alvo.coluna];
  dicaCel.el.classList.add('dica');
  dicasUsadas++;
  dicasEl.textContent = dicasUsadas;
  iniciarRelogio();
  if (cfg.dicaDirecao) {
    mensagem('Dica: o termo de ' + alvo.resposta.length + ' letras que começa com "' + alvo.resposta[0] +
      '" começa na casa destacada e segue ' + NOME_DIRECAO[alvo.dl + ',' + alvo.dc] + '.', 'destaque');
  } else {
    mensagem('Dica: o termo escolhido, de ' + alvo.resposta.length + ' letras, começa na casa destacada. A direção é com você.', 'destaque');
  }
}

// Volta à fase 1, zera tempo e dicas e sorteia tudo de novo (palavras e posições).
function reiniciarTudo() {
  partida = sortearPartida();
  segundos = 0;
  dicasUsadas = 0;
  iniciarNivel(0);
}

function pedirReinicio() {
  const temProgresso = nivelAtual > 0 || achadas > 0;
  if (temProgresso && !window.confirm('Reiniciar volta à fase 1 e sorteia tudo de novo, inclusive as palavras. Continuar?')) return;
  reiniciarTudo();
}

document.getElementById('btn-dica').addEventListener('click', pedirDica);
document.getElementById('btn-reiniciar').addEventListener('click', pedirReinicio);
btnFinal.addEventListener('click', () => { if (acaoFinal) acaoFinal(); });

reiniciarTudo();