// Seleção dos elementos do DOM
const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');

// Banco de frases para o teste
const sampleTexts = [
  "O posicionamento correto dos dedos nas teclas de guia é fundamental para aumentar a velocidade de digitação sem precisar olhar para o teclado.",
  "Praticar digitação diariamente melhora a memória muscular dos dedos e reduz drasticamente a taxa de erros durante o trabalho.",
  "Teclados mecânicos oferecem um feedback tátil superior e podem ajudar na precisão e no conforto durante longas sessões de escrita.",
  "Manter uma boa postura e apoiar os pulsos adequadamente previne lesões por esforço repetitivo ao utilizar o computador."
];

// Variáveis de controle de estado
let timeLeft = 60;
let timer = null;
let isStarted = false;
let totalTypedChars = 0;
let totalErrors = 0;
let currentText = "";

// Inicializa ou reinicia o teste
function initTest() {
  // Limpar cronômetro se estiver ativo
  clearInterval(timer);
  
  // Resetar variáveis
  timeLeft = 60;
  isStarted = false;
  totalTypedChars = 0;
  totalErrors = 0;
  
  // Resetar interface
  timerElement.textContent = timeLeft;
  wpmElement.textContent = '0';
  accuracyElement.textContent = '100%';
  inputField.value = '';
  inputField.disabled = false;
  
  // Selecionar texto aleatório
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  currentText = sampleTexts[randomIndex];
  
  // Renderizar o texto dentro de spans individuais para cada caractere
  textDisplay.innerHTML = '';
  currentText.split('').forEach((char, index) => {
    const charSpan = document.createElement('span');
    charSpan.classList.add('letter');
    if (index === 0) charSpan.classList.add('current');
    charSpan.innerText = char;
    textDisplay.appendChild(charSpan);
  });
  
  inputField.focus();
}

// Inicia o contagiador regressivo de tempo
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerElement.textContent = timeLeft;
      updateWpm();
    } else {
      finishTest();
    }
  }, 1000);
}

// Processa a digitação do usuário
function handleInput() {
  const arrayText = textDisplay.querySelectorAll('.letter');
  const arrayValue = inputField.value.split('');
  
  // Iniciar o cronômetro na primeira tecla pressionada
  if (!isStarted && arrayValue.length > 0) {
    isStarted = true;
    startTimer();
  }

  let correctCount = 0;
  let currentErrors = 0;

  arrayText.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    // Limpar classes de cursor e estado do caractere
    characterSpan.classList.remove('current', 'correct', 'incorrect');

    if (character == null) {
      // Caractere ainda não digitado
      if (index === arrayValue.length) {
        characterSpan.classList.add('current');
      }
    } else if (character === characterSpan.innerText) {
      // Caractere correto
      characterSpan.classList.add('correct');
      correctCount++;
    } else {
      // Caractere incorreto
      characterSpan.classList.add('incorrect');
      currentErrors++;
    }
  });

  // Atualizar precisão
  const typedLength = arrayValue.length;
  if (typedLength > 0) {
    const accuracy = Math.max(0, Math.round(((typedLength - currentErrors) / typedLength) * 100));
    accuracyElement.textContent = `${accuracy}%`;
  } else {
    accuracyElement.textContent = '100%';
  }

  // Atualizar WPM instantâneo
  updateWpm();

  // Finalizar o teste se o texto for concluído antes do tempo
  if (typedLength >= currentText.length) {
    finishTest();
  }
}

// Calcula as Palavras Por Minuto (WPM)
function updateWpm() {
  const timeElapsed = 60 - timeLeft;
  if (timeElapsed === 0) return;

  const typedChars = inputField.value.length;
  // Convenção padrão: 1 palavra = 5 caracteres
  const wordsTyped = typedChars / 5;
  const wpm = Math.round((wordsTyped / timeElapsed) * 60);

  wpmElement.textContent = wpm >= 0 ? wpm : 0;
}

// Finaliza a sessão de teste
function finishTest() {
  clearInterval(timer);
  inputField.disabled = true;
  
  // Remover indicação visual do cursor
  const currentSpan = textDisplay.querySelector('.current');
  if (currentSpan) {
    currentSpan.classList.remove('current');
  }
}

// Event Listeners
inputField.addEventListener('input', handleInput);
restartBtn.addEventListener('click', initTest);

// Inicializar ao carregar o script
initTest();