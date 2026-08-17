/**
 * Widget de Accesibilidad — Paleta Dorada
 * =========================================================
 * Funciones: lector de voz, alto contraste, escala de grises,
 * fuente dislexia, tamaño de texto y guía de lectura.
 * Sin dependencias externas. Sin costo. Sin servidor.
 * Compatible con Chrome, Edge, Firefox y Safari.
 */

(function () {
  'use strict';

  /* ── Estado interno ───────────────────────────────────── */
  const state = {
    contrast:  false,
    grayscale: false,
    dyslexia:  false,
    underline: false,
    fontSize:  0,
  };

  const synth = window.speechSynthesis;
  let utterance = null;
  let isPaused  = false;
  let panelOpen = false;

  /* ==========================================================
     ÍCONO DEL BOTÓN FLOTANTE
     ----------------------------------------------------------
     Actualmente se usa un SVG inline (la figura de accesibilidad).
     Si quieres usar una imagen propia (PNG, JPG, SVG externo),
     reemplaza el contenido de FAB_ICON por una etiqueta <img>:

     OPCIÓN A — imagen local (sube tu imagen a /var/www/html/):
       const FAB_ICON = `<img src="mi-icono.png" alt="Accesibilidad" style="width:32px;height:32px;object-fit:contain;">`;

     OPCIÓN B — imagen externa (URL):
       const FAB_ICON = `<img src="https://ejemplo.com/icono.png" alt="Accesibilidad" style="width:32px;height:32px;object-fit:contain;">`;

     OPCIÓN C — SVG externo:
       const FAB_ICON = `<img src="icono.svg" alt="Accesibilidad" style="width:32px;height:32px;">`;

     Nota: si usas <img>, asegúrate de que el CSS tenga:
       #acc-fab { overflow: hidden; }   ← ya está incluido en el CSS
  ========================================================== */
  const FAB_ICON = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true" style="width:28px;height:28px;fill:#fff;">
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 5H4a1 1 0 0 0 0
               2h3.18l-2.1 8H7a1 1 0 0 0 0 2h3a1 1 0 0 0 .98-.8L12
               12.22l1.02 5.98-.01-.2H13a1 1 0 0 0 0 2h3a1 1 0 0 0
               0-2h-1.08l-2.1-8H20a1 1 0 0 0 0-2z"/>
    </svg>`;

  /* ==========================================================
     ÍCONO DEL TÍTULO DEL PANEL
     ----------------------------------------------------------
     Mismo ícono que el botón flotante pero más pequeño.
     Cámbialo igual que FAB_ICON si quieres que coincidan.
  ========================================================== */
  const PANEL_TITLE_ICON = `
    <svg viewBox="0 0 24 24" width="15" height="15"
         fill="#C9960C" aria-hidden="true">
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 5H4a1 1 0 0 0 0
               2h3.18l-2.1 8H7a1 1 0 0 0 0 2h3a1 1 0 0 0 .98-.8L12
               12.22l1.02 5.98-.01-.2H13a1 1 0 0 0 0 2h3a1 1 0 0 0
               0-2h-1.08l-2.1-8H20a1 1 0 0 0 0-2z"/>
    </svg>`;

  /* ── Construcción del HTML del widget ─────────────────── */
  function buildWidget() {

    /* Botón flotante */
    const fab = document.createElement('button');
    fab.id = 'acc-fab';
    fab.setAttribute('aria-label', 'Abrir menú de accesibilidad');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = FAB_ICON; /* ← aquí se inserta el ícono */

    /* Panel */
    const panel = document.createElement('div');
    panel.id = 'acc-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Opciones de accesibilidad');
    panel.innerHTML = `

      <!-- Título del panel -->
      <div class="acc-panel-title">
        ${PANEL_TITLE_ICON}
        Accesibilidad
      </div>

      <!-- Lector de voz -->
      <button class="acc-item" id="acc-btn-voice" style="cursor:default;">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14
                   7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06
                   c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06
                   c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        Lector de pantalla
      </button>

      <!-- Controles del lector -->
      <div class="acc-voice-controls">
        <button class="acc-voice-btn" id="acc-voice-play" aria-label="Leer página">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          Leer
        </button>
        <button class="acc-voice-btn" id="acc-voice-pause" disabled aria-label="Pausar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          Pausa
        </button>
        <button class="acc-voice-btn" id="acc-voice-stop" disabled aria-label="Detener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>
          Stop
        </button>
      </div>
      <div class="acc-status" id="acc-voice-status">Listo</div>

      <!-- Alto contraste -->
      <button class="acc-item" id="acc-btn-contrast">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3a9 9 0 0 0 0 18V3z"/>
        </svg>
        Alto contraste
      </button>

      <!-- Escala de grises -->
      <button class="acc-item" id="acc-btn-grayscale">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                   10-4.48 10-10S17.52 2 12 2zm-1 17.93
                   c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79
                   L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54
                   c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1
                   H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41
                   c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        Escala de grises
      </button>

      <!-- Fuente dislexia -->
      <button class="acc-item" id="acc-btn-dyslexia">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.93 13.5h4.14L12 7.98 9.93 13.5zM20 2H4c-1.1 0-2
                   .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4
                   c0-1.1-.9-2-2-2zm-4.05 16.5-1.14-3H9.17l-1.12 3
                   H5.96l5.11-13h1.86l5.11 13h-2.09z"/>
        </svg>
        Fuente dislexia
      </button>

      <!-- Tamaño de texto -->
      <div class="acc-font-row">
        <button id="acc-btn-bigger"  aria-label="Aumentar tamaño de texto">A+</button>
        <button id="acc-btn-smaller" aria-label="Reducir tamaño de texto">A−</button>
      </div>

      <!-- Guía de lectura -->
      <button class="acc-item" id="acc-btn-underline">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57
                   3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69
                   6 6 6zm-7 2v2h14v-2H5z"/>
        </svg>
        Guía de lectura
      </button>

      <!-- Restablecer -->
      <button class="acc-reset" id="acc-btn-reset">↺ Restablecer todo</button>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }

  /* ── Toggle del panel ────────────────────────────────── */
  function togglePanel() {
    panelOpen = !panelOpen;
    document.getElementById('acc-panel').classList.toggle('open', panelOpen);
    document.getElementById('acc-fab').setAttribute('aria-expanded', panelOpen);
  }

  /* ── Obtener texto de la página ──────────────────────── */
  function getPageText() {
    const main = document.querySelector('main')       ||
                 document.querySelector('article')    ||
                 document.querySelector('#contenido') ||
                 document.body;
    const clone = main.cloneNode(true);
    clone.querySelectorAll('#acc-panel, #acc-fab').forEach(el => el.remove());
    return clone.innerText || clone.textContent || '';
  }

  /* ── Lector de voz: reproducir ───────────────────────── */
  function voicePlay() {
    if (isPaused) {
      synth.resume();
      isPaused = false;
      setVoiceStatus('Leyendo...');
      setVoiceBtns(true);
      return;
    }
    synth.cancel();
    const text = getPageText().trim();
    if (!text) { setVoiceStatus('No hay texto para leer'); return; }

    utterance = new SpeechSynthesisUtterance(text);

    /* Buscar voz en español */
    const voices  = synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    utterance.lang  = 'es-MX';
    utterance.rate  = 1;
    utterance.pitch = 1;

    utterance.onstart = () => { setVoiceStatus('Leyendo...'); setVoiceBtns(true); };
    utterance.onend   = () => { setVoiceStatus('Completado'); setVoiceBtns(false); isPaused = false; };
    utterance.onerror = () => { setVoiceStatus('Error al leer'); setVoiceBtns(false); };

    synth.speak(utterance);
  }

  /* ── Lector de voz: pausar ───────────────────────────── */
  function voicePause() {
    if (synth.speaking && !isPaused) {
      synth.pause();
      isPaused = true;
      setVoiceStatus('Pausado');
      document.getElementById('acc-voice-play').innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg> Continuar';
    }
  }

  /* ── Lector de voz: detener ──────────────────────────── */
  function voiceStop() {
    synth.cancel();
    isPaused = false;
    setVoiceStatus('Detenido');
    setVoiceBtns(false);
    document.getElementById('acc-voice-play').innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg> Leer';
  }

  /* ── Helpers del lector ──────────────────────────────── */
  function setVoiceBtns(playing) {
    document.getElementById('acc-voice-pause').disabled = !playing;
    document.getElementById('acc-voice-stop').disabled  = !playing;
    document.getElementById('acc-voice-play').classList.toggle('playing', playing);
  }

  function setVoiceStatus(msg) {
    document.getElementById('acc-voice-status').textContent = msg;
  }

  /* ── Modos de accesibilidad ──────────────────────────── */
  function toggleClass(className, btnId) {
    state[className.replace('acc-', '')] = !state[className.replace('acc-', '')];
    document.body.classList.toggle(className);
    document.getElementById(btnId).classList.toggle('active');
  }

  function changeFontSize(dir) {
    const newStep = state.fontSize + dir;
    if (newStep < -3 || newStep > 5) return;
    state.fontSize = newStep;
    document.documentElement.style.fontSize = (16 + state.fontSize * 2) + 'px';
  }

  /* ── Restablecer todo ────────────────────────────────── */
  function resetAll() {
    synth.cancel();
    isPaused = false;
    setVoiceBtns(false);
    setVoiceStatus('Listo');
    document.getElementById('acc-voice-play').innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg> Leer';

    ['acc-contrast','acc-grayscale','acc-dyslexia','acc-underline'].forEach(c => {
      document.body.classList.remove(c);
    });

    document.documentElement.style.fontSize = '';
    state.fontSize = 0;

    ['acc-btn-contrast','acc-btn-grayscale','acc-btn-dyslexia','acc-btn-underline'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    Object.keys(state).forEach(k => { if (k !== 'fontSize') state[k] = false; });
  }

  /* ── Cerrar al hacer clic fuera del panel ────────────── */
  function handleOutsideClick(e) {
    const panel = document.getElementById('acc-panel');
    const fab   = document.getElementById('acc-fab');
    if (panelOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
      panelOpen = false;
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
    }
  }

  /* ── Inicialización ──────────────────────────────────── */
  function init() {
    buildWidget();

    document.getElementById('acc-fab').addEventListener('click', togglePanel);
    document.getElementById('acc-voice-play').addEventListener('click', voicePlay);
    document.getElementById('acc-voice-pause').addEventListener('click', voicePause);
    document.getElementById('acc-voice-stop').addEventListener('click', voiceStop);
    document.getElementById('acc-btn-contrast').addEventListener('click',
      () => toggleClass('acc-contrast', 'acc-btn-contrast'));
    document.getElementById('acc-btn-grayscale').addEventListener('click',
      () => toggleClass('acc-grayscale', 'acc-btn-grayscale'));
    document.getElementById('acc-btn-dyslexia').addEventListener('click',
      () => toggleClass('acc-dyslexia', 'acc-btn-dyslexia'));
    document.getElementById('acc-btn-underline').addEventListener('click',
      () => toggleClass('acc-underline', 'acc-btn-underline'));
    document.getElementById('acc-btn-bigger').addEventListener('click',
      () => changeFontSize(1));
    document.getElementById('acc-btn-smaller').addEventListener('click',
      () => changeFontSize(-1));
    document.getElementById('acc-btn-reset').addEventListener('click', resetAll);

    document.addEventListener('click', handleOutsideClick);

    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => {};
  }

  /* Esperar a que el DOM esté listo antes de iniciar */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
