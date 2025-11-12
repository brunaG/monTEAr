// ============================================
// APPLICATION STATE (In-memory storage)
// ============================================
const AppState = {
  studentName: '',
  selectedTheme: '', // 'stitch' or 'minecraft'
  voiceSpeed: 1,
  menus: [
    {
      nome: 'Necessidades',
      cor: '#FF6B6B',
      pictogramas: [
        { texto: 'Água', emoji: '💧' },
        { texto: 'Comida', emoji: '🍽️' },
        { texto: 'Banheiro', emoji: '🚽' },
        { texto: 'Descanso', emoji: '🛏️' },
        { texto: 'Ajuda', emoji: '🙋' }
      ]
    },
    {
      nome: 'Emoções',
      cor: '#4ECDC4',
      pictogramas: [
        { texto: 'Feliz', emoji: '😊' },
        { texto: 'Triste', emoji: '😢' },
        { texto: 'Bravo', emoji: '😠' },
        { texto: 'Assustado', emoji: '😨' },
        { texto: 'Calmo', emoji: '😌' },
        { texto: 'Cansado', emoji: '😴' }
      ]
    },
    {
      nome: 'Ações',
      cor: '#95E1D3',
      pictogramas: [
        { texto: 'Eu quero', emoji: '👉' },
        { texto: 'Não quero', emoji: '🛑' },
        { texto: 'Sim', emoji: '👍' },
        { texto: 'Não', emoji: '👎' },
        { texto: 'Por favor', emoji: '🙏' },
        { texto: 'Obrigado', emoji: '❤️' }
      ]
    },
    {
      nome: 'Pessoas',
      cor: '#F38181',
      pictogramas: [
        { texto: 'Eu', emoji: '🙋' },
        { texto: 'Você', emoji: '👤' },
        { texto: 'Eles', emoji: '👤' },
        { texto: 'Nós', emoji: '👤' },
        { texto: 'Professor', emoji: '👩' },
        { texto: 'Colega', emoji: '👨' },
        { texto: 'Amigo', emoji: '👫' }
      ]
    },
    {
      nome: 'Lugares',
      cor: '#AA96DA',
      pictogramas: [
        { texto: 'Casa', emoji: '🏠' },
        { texto: 'Escola', emoji: '🏫' },
        { texto: 'Parque', emoji: '🌳' },
        { texto: 'Médico', emoji: '🏥' }
      ]
    },
    {
      nome: 'Objetos',
      cor: '#FCBAD3',
      pictogramas: [
        { texto: 'Livro', emoji: '📚' },
        { texto: 'Bola', emoji: '⚽' },
        { texto: 'Música', emoji: '🎵' },
        { texto: 'Vídeo', emoji: '📺' },
        { texto: 'Tablet', emoji: '📱' },
        { texto: 'Brinquedo', emoji: '🧸' }
      ]
    }
  ],
  statistics: {
    // ... (seu estado de estatísticas)
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function playSound(frequency = 600, duration = 100) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio not available');
  }
}

// ============================================
// ATUALIZAÇÃO: FUNÇÃO DE FALA (VOZ DO STITCH)
// ============================================
function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    // Configurações padrão
    utterance.rate = parseFloat(AppState.voiceSpeed);
    utterance.pitch = 1;

    // --- MODIFICAÇÃO VOZ STITCH ---
    if (AppState.selectedTheme === 'stitch') {
      utterance.pitch = 1.6; // Deixa a voz mais aguda
      utterance.rate = utterance.rate * 1.3; // Deixa a voz mais rápida
    }
    // --- FIM DA MODIFICAÇÃO ---

    window.speechSynthesis.speak(utterance);
  } else {
    console.log('Speech synthesis not available');
  }
}

// ATUALIZADO: Esta função não é mais necessária, pois os emojis foram removidos.
function getEmoji(text) {
  return '';
}

function applyTheme(theme) {
  document.body.classList.remove('theme-stitch', 'theme-minecraft');
  document.body.classList.add(`theme-${theme}`);
  AppState.selectedTheme = theme;
}

// ============================================
// WELCOME SCREEN & PROFILE SETUP
// ============================================
function setupWelcomeScreen() {
  const nameInput = document.getElementById('student-name');
  const startBtn = document.getElementById('btn-start');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Variável local para o tema, para garantir que a validação funcione
  let selectedTheme = '';

  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      playSound(500, 80);
      themeOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      // Define a variável local
      selectedTheme = option.getAttribute('data-theme');
      validateForm();
    });
  });

  nameInput.addEventListener('input', validateForm);

  function validateForm() {
    const name = nameInput.value.trim();
    // Valida usando a variável local
    startBtn.disabled = !(name && selectedTheme);
  }

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    // Confere a variável local antes de prosseguir
    if (name && selectedTheme) {
      AppState.studentName = name; // Salva no estado global
      applyTheme(selectedTheme);  // Salva no estado global
      playSound(700, 150);
      showScreen('main-menu-screen');
      renderMainMenu();

      // Mostra a barra de busca global e adiciona a classe ao body
      document.getElementById('global-search-bar').style.display = 'flex';
      document.body.classList.add('search-bar-visible');
    }
  });
}

// ============================================
// MAIN MENU
// ============================================
function renderMainMenu() {
  const userInfo = document.getElementById('user-info');
  // ATUALIZAÇÃO: Removido o emoji do tema
  userInfo.innerHTML = `${AppState.studentName}`; // NOVO

  const menuGrid = document.getElementById('main-menu-grid');
  menuGrid.innerHTML = AppState.menus.map(menu => `
    <div class="menu-card" data-menu-nome="${menu.nome}" role="button" tabindex="0" aria-label="${menu.nome}">
      <div class="menu-text">${menu.nome}</div>
    </div>
  `).join('');

  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      playSound(600, 100);
      e.currentTarget.classList.add('clicked');
      setTimeout(() => e.currentTarget.classList.remove('clicked'), 300);

      const menuNome = card.getAttribute('data-menu-nome');
      handleMenuClick(menuNome);
    });

    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const menuNome = card.getAttribute('data-menu-nome');
        handleMenuClick(menuNome);
      }
    });
  });
}

function handleMenuClick(menuNome) {
  const menu = AppState.menus.find(m => m.nome === menuNome);
  if (!menu) return;
  renderSubmenu(menu.nome, menu.pictogramas);
}

function renderSubmenu(title, pictogramas) {
  showScreen('submenu-screen');
  document.getElementById('submenu-title').textContent = title;

  const actionsGrid = document.getElementById('actions-grid');
  // ATUALIZAÇÃO: Removido o {pictograma.emoji}
  actionsGrid.innerHTML = pictogramas.map(pictograma => {
    return `
      <div class="action-card" data-action="${pictograma.texto}" role="button" tabindex="0" aria-label="${pictograma.texto}">
        <div class="action-icon"></div>
        <div class="action-text">${pictograma.texto}</div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const action = card.getAttribute('data-action');
      handleActionClick(action, e.currentTarget);
    });

    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const action = card.getAttribute('data-action');
        handleActionClick(action, e.currentTarget);
      }
    });
  });
}

function handleActionClick(action, element) {
  playSound(700, 120);
  if (element) {
    element.classList.add('clicked');
    setTimeout(() => element.classList.remove('clicked'), 300);
  }
  speak(action);
}

// ============================================
// SEARCH FUNCTIONALITY (TELA ANTIGA)
// ============================================
// CORREÇÃO: A lógica de busca estava fora de uma função.
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput) return; // Proteção caso o elemento não exista

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchResults.innerHTML = '<p class="search-placeholder">Digite algo no campo acima para buscar</p>';
      return;
    }

    const results = {};

    AppState.menus.forEach(menu => {
      const matchingActions = [];
      if (menu.pictogramas) {
        menu.pictogramas.forEach(pictograma => {
          if (pictograma.texto.toLowerCase().includes(query)) {
            matchingActions.push(pictograma);
          }
        });
      }
      if (matchingActions.length > 0) {
        results[menu.nome] = matchingActions;
      }
    });

    if (Object.keys(results).length === 0) {
      searchResults.innerHTML = '<p class="search-placeholder">Nenhum resultado encontrado</p>';
      return;
    }

    // ATUALIZAÇÃO: Removido o {pictograma.emoji}
    searchResults.innerHTML = Object.entries(results).map(([category, pictos]) => `
      <div class="search-category">
        <h3 class="search-category-title">${category}</h3>
        <div class="search-actions">
          ${pictos.map(pictograma => {
            return `
              <div class="action-card" data-action="${pictograma.texto}" role="button" tabindex="0" aria-label="${pictograma.texto}">
                <div class="action-icon"></div>
                <div class="action-text">${pictograma.texto}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.search-actions .action-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const action = card.getAttribute('data-action');
        handleActionClick(action, e.currentTarget);
      });
    });
  });
}

// ============================================
// NOVA FUNCIONALIDADE: BUSCA GLOBAL
// ============================================
function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const clearBtn = document.getElementById('btn-clear-search');

  searchInput.addEventListener('input', handleGlobalSearch);

  searchInput.addEventListener('focusin', () => {
    if (searchInput.value.trim()) {
      handleGlobalSearch();
    }
  });

  searchInput.addEventListener('focusout', () => {
    // Atraso para permitir o clique no resultado
    setTimeout(() => {
      resultsContainer.style.display = 'none';
    }, 200);
  });

  clearBtn.addEventListener('click', clearGlobalSearch);
}

function handleGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('btn-clear-search');
  const query = searchInput.value.trim().toLowerCase();

  clearBtn.style.display = query ? 'inline-flex' : 'none';

  if (!query) {
    document.getElementById('global-search-results').style.display = 'none';
    return;
  }

  const matchingMenus = [];
  const matchingPictograms = [];

  AppState.menus.forEach(menu => {
    // 1. Busca menus
    if (menu.nome.toLowerCase().includes(query)) {
      matchingMenus.push(menu);
    }

    // 2. Busca pictogramas
    if (menu.pictogramas) {
      menu.pictogramas.forEach(pictograma => {
        if (pictograma.texto.toLowerCase().includes(query)) {
          matchingPictograms.push({
            ...pictograma, // Copia {texto, emoji}
            menuNome: menu.nome // Adiciona a que menu pertence
          });
        }
      });
    }
  });

  renderGlobalResults(matchingMenus, matchingPictograms);
}

function renderGlobalResults(menus, pictos) {
  const resultsContainer = document.getElementById('global-search-results');
  let html = '<ul class="search-results-list">';

  if (menus.length === 0 && pictos.length === 0) {
    html += '<li class="search-result-placeholder">Nenhum resultado encontrado</li>';
  } else {
    // Renderiza menus
    if (menus.length > 0) {
      html += '<li class="search-result-header">Menus</li>';
      menus.forEach(menu => {
        html += `
          <li class="search-result-menu" data-menu-nome="${menu.nome}" role="button" tabindex="0">
            <span class="search-result-menu-text">${menu.nome}</span>
          </li>
        `;
      });
    }

    // Renderiza pictogramas
    if (pictos.length > 0) {
      html += '<li class="search-result-header">Pictogramas</li>';
      html += '<li class="search-result-pictograms">';
      // ATUALIZAÇÃO: Removido o {pictograma.emoji}
      pictos.forEach(pictograma => {
        html += `
          <div class="action-card" data-action="${pictograma.texto}" role="button" tabindex="0" aria-label="${pictograma.texto} (em ${pictograma.menuNome})">
            <div class="action-icon"></div>
            <div class="action-text">${pictograma.texto}</div>
          </div>
        `;
      });
      html += '</li>';
    }
  }

  html += '</ul>';
  resultsContainer.innerHTML = html;
  resultsContainer.style.display = 'block';

  // Adiciona listeners aos novos resultados
  resultsContainer.querySelectorAll('.search-result-menu').forEach(card => {
    card.addEventListener('mousedown', (e) => { // mousedown para ser mais rápido que o focusout
      const menuNome = e.currentTarget.getAttribute('data-menu-nome');
      handleMenuClick(menuNome);
      clearGlobalSearch();
    });
  });

  resultsContainer.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('mousedown', (e) => { // mousedown
      const action = e.currentTarget.getAttribute('data-action');
      handleActionClick(action, e.currentTarget);
      clearGlobalSearch();
    });
  });
}

function clearGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const clearBtn = document.getElementById('btn-clear-search');

  searchInput.value = '';
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'none';
  clearBtn.style.display = 'none';
}


// ============================================
// NOVA FUNCIONALIDADE: RECONHECIMENTO DE VOZ
// ============================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

function setupVoiceRecognition() {
  if (!SpeechRecognition) {
    console.warn("Reconhecimento de voz não é suportado neste navegador.");
    // Esconde os botões de microfone
    document.getElementById('btn-voice-search').style.display = 'none';
    document.getElementById('btn-voice-search-page').style.display = 'none';
    return;
  }

  const btnGlobal = document.getElementById('btn-voice-search');
  const btnPage = document.getElementById('btn-voice-search-page');

  btnGlobal.addEventListener('click', () => startRecognition(true, btnGlobal));
  btnPage.addEventListener('click', () => startRecognition(false, btnPage));
}

function startRecognition(isGlobal, buttonElement) {
  if (recognition && recognition.isListening) {
    recognition.stop();
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.isListening = true;
  buttonElement.classList.add('is-listening');

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    if (isGlobal) {
      // Alimenta a barra de busca GLOBAL
      const input = document.getElementById('global-search-input');
      input.value = transcript;
      handleGlobalSearch(); // Dispara a busca
    } else {
      // Alimenta a barra de busca da PÁGINA
      const input = document.getElementById('search-input');
      input.value = transcript;
      // Dispara o evento de 'input' para o listener da página de busca
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  recognition.onerror = (event) => {
    console.error("Erro no reconhecimento de voz:", event.error);
  };

  recognition.onend = () => {
    recognition.isListening = false;
    buttonElement.classList.remove('is-listening');
  };

  recognition.start();
}


// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
  document.getElementById('btn-back-to-menu').addEventListener('click', () => {
    playSound(500, 80);
    showScreen('main-menu-screen');
  });

  // ATUALIZAÇÃO: Removido o `confirm()`
  document.getElementById('btn-change-profile').addEventListener('click', () => {
    playSound(500, 80);

    // Ação direta sem confirmação (conforme diretrizes)
    AppState.studentName = '';
    AppState.selectedTheme = '';
    showScreen('welcome-screen');

    // --- NOVO ---
    // Esconde a barra de busca global e remove a classe do body
    document.getElementById('global-search-bar').style.display = 'none';
    document.body.classList.remove('search-bar-visible');
    clearGlobalSearch(); // Limpa o estado da busca

    // Reseta o formulário
    document.getElementById('student-name').value = '';
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('btn-start').disabled = true;
  });

  document.getElementById('btn-back-to-menu-from-search').addEventListener('click', () => {
    playSound(500, 80);
    showScreen('main-menu-screen');
  });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  console.log('Inicializando monTEAr...');

  initializeEventListeners();
  setupWelcomeScreen();
  setupSearch(); // Configura a tela de busca antiga

  // --- NOVO ---
  setupGlobalSearch(); // Configura a nova barra de busca global
  setupVoiceRecognition(); // Configura o reconhecimento de voz

  showScreen('welcome-screen');
  console.log('monTEAr pronto!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
