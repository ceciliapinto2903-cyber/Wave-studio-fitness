/**
 * WAVE STUDIO FITNESS & HEALTH — site.js  v6.0
 * ═══════════════════════════════════════════════════════════════
 * Ficheiro JavaScript ÚNICO para todas as páginas do site.
 * Organizado em módulos IIFE independentes.
 * Cada módulo verifica se os elementos existem antes de correr.
 * Falha silenciosamente se não encontrar os elementos.
 *
 * MÓDULOS:
 *   01. Navbar scroll        → adiciona .navbar--scrolled
 *   02. Navbar hamburger     → fecha menu ao clicar (ID: menuNav)
 *   03. Scroll suave         → âncoras internas com offset navbar
 *   04. Reveal on scroll     → fade-in com IntersectionObserver
 *   05. Contadores animados  → easing cubic ease-out
 *   06. Seletor de serviço   → formulário dinâmico WhatsApp
 *   07. Reserva WhatsApp     → construção e envio de mensagem
 *   08. Lightbox             → galeria de imagens
 *   09. Cookies RGPD         → banner + localStorage
 *   10. GTM DataLayer        → helper de conversões
 *
 * CONVENÇÕES UNIFICADAS:
 *   Navbar ID  → "navbar"      (mesmo em index e subpáginas)
 *   Menu ID    → "menuNav"     (mesmo em index e subpáginas)
 *   Reveal     → .is-visible   (classe de activação CSS)
 *   Cookies fn → aceitarCookies() / recusarCookies()
 * ═══════════════════════════════════════════════════════════════
 */


/* ─────────────────────────────────────────────────────────────────
   01. NAVBAR SCROLL — Sombra e fundo sólido ao fazer scroll
       CSS: .navbar--scrolled em style.css
   ───────────────────────────────────────────────────────────────── */
(function navbarScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); /* Executar no load se a página já estiver scrollada */
})();


/* ─────────────────────────────────────────────────────────────────
   02. NAVBAR HAMBURGER — Abre/fecha menu mobile
       Funciona com Bootstrap 5 E como fallback puro JS.
       ID do menu: "menuNav" | Botão: .navbar-toggler
   ───────────────────────────────────────────────────────────────── */
(function navbarHamburger() {
  var menu    = document.getElementById('menuNav');
  var toggler = document.querySelector('.navbar-toggler');
  if (!menu || !toggler) return;

  /* ── Abre / fecha com fallback puro JS ── */
  function isOpen() {
    return menu.classList.contains('show');
  }

  function openMenu() {
    menu.classList.add('show', 'collapse');
    menu.style.display = '';
    toggler.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('show');
    toggler.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (isOpen()) { closeMenu(); } else { openMenu(); }
  }

  /* Clique no botão hamburger */
  toggler.addEventListener('click', function(e) {
    e.stopPropagation();

    /* Tentar Bootstrap 5 primeiro */
    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
      var instance = bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });
      instance.toggle();
      return;
    }

    /* Fallback puro JS se Bootstrap não estiver disponível */
    toggleMenu();
  });

  /* Fecha ao clicar num link dentro do menu */
  menu.querySelectorAll('.nav-link, .btn').forEach(function(el) {
    el.addEventListener('click', function() {
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        var instance = bootstrap.Collapse.getInstance(menu);
        if (instance) { instance.hide(); return; }
      }
      closeMenu();
    });
  });

  /* Fecha ao clicar fora do menu */
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !toggler.contains(e.target)) {
      if (isOpen()) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
          var instance = bootstrap.Collapse.getInstance(menu);
          if (instance) { instance.hide(); return; }
        }
        closeMenu();
      }
    }
  });

  /* Fecha com tecla Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggler.focus();
    }
  });
})();


/* ─────────────────────────────────────────────────────────────────
   03. SCROLL SUAVE — Âncoras internas com offset da navbar
       Funciona para links href="#id" em qualquer página
   ───────────────────────────────────────────────────────────────── */
(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href  = this.getAttribute('href');
      var alvo  = document.querySelector(href);
      if (!alvo || href === '#') return;
      e.preventDefault();

      /* Lê a altura da navbar dos tokens CSS */
      var navH   = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')
      ) || 76;
      var posY   = alvo.getBoundingClientRect().top + window.pageYOffset - navH - 16;
      window.scrollTo({ top: posY, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   04. REVEAL ON SCROLL — Fade-in ao entrar no viewport
       Classe CSS de entrada: .is-visible (em style.css)
       Classe HTML no elemento: .reveal
       Mais eficiente que scroll events (usa IntersectionObserver)
   ───────────────────────────────────────────────────────────────── */
(function revealOnScroll() {
  var elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); /* Anima apenas 1 vez */
      });
    },
    { threshold: 0.10 } /* Dispara ao 10% de visibilidade */
  );

  elementos.forEach(function(el) { observer.observe(el); });
})();


/* ─────────────────────────────────────────────────────────────────
   05. CONTADORES ANIMADOS — Easing cubic ease-out
       Selector: .counter-num[data-target]
       Atributo: data-target="847"
       Sufixo opcional: data-suffix="%"
   ───────────────────────────────────────────────────────────────── */
(function animatedCounters() {
  var contadores = document.querySelectorAll('.counter-num[data-target]');
  if (!contadores.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;

        var el      = entry.target;
        var target  = parseInt(el.getAttribute('data-target'), 10);
        var suffix  = el.getAttribute('data-suffix') || '';
        var duracao = 1800; /* ms */
        var inicio  = null;

        function step(timestamp) {
          if (!inicio) inicio = timestamp;
          var progresso = Math.min((timestamp - inicio) / duracao, 1);
          /* Cubic ease-out: suave no final */
          var eased     = 1 - Math.pow(1 - progresso, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progresso < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  contadores.forEach(function(el) { observer.observe(el); });
})();


/* ─────────────────────────────────────────────────────────────────
   05-B. PT TABS — Toggle Individual | Duo (servicos.html)
       Container ID: "ptTabs"
       Botões: .pt-tab[data-panel]
       Painéis: .pt-panel[id]
       Imagem: #pt-img (troca src ao mudar tab)
   ───────────────────────────────────────────────────────────────── */
(function ptTabs() {
  var container = document.getElementById('ptTabs');
  if (!container) return;

  var tabs    = container.querySelectorAll('.pt-tab');
  var ptImg   = document.getElementById('pt-img');

  var imgMap = {
    'pt-individual': '../assets/images/services/pt-individual.webp',
    'pt-duo':        '../assets/images/services/treino-autonomo.webp'
  };

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var panelId = tab.getAttribute('data-panel');
      if (!panelId) return;

      /* Desactivar todos os tabs e painéis */
      tabs.forEach(function(t) {
        t.classList.remove('pt-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.pt-panel').forEach(function(p) {
        p.classList.remove('pt-panel--active');
      });

      /* Activar o tab e painel clicados */
      tab.classList.add('pt-tab--active');
      tab.setAttribute('aria-selected', 'true');

      var panel = document.getElementById(panelId);
      if (panel) panel.classList.add('pt-panel--active');

      /* Trocar imagem se mapeada */
      if (ptImg && imgMap[panelId]) {
        ptImg.src = imgMap[panelId];
      }
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   06. SELETOR DINÂMICO DE SERVIÇO
       ID do container: "srvSelector"
       Classe dos botões: .srv-sel-btn
       Atributos: data-tipo, data-context, data-icon
       Contextbox ID: "srvContext", "ctxIcon", "ctxTxt"
   ───────────────────────────────────────────────────────────────── */
(function srvSelector() {
  var container = document.getElementById('srvSelector');
  if (!container) return;

  var btns    = container.querySelectorAll('.srv-sel-btn');
  var ctxDiv  = document.getElementById('srvContext');
  var ctxIcon = document.getElementById('ctxIcon');
  var ctxTxt  = document.getElementById('ctxTxt');

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      /* Remover estado activo de todos */
      btns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });

      /* Activar o clicado */
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      /* Actualizar contexto dinâmico */
      if (ctxTxt)  ctxTxt.textContent = btn.getAttribute('data-context') || '';
      if (ctxIcon) ctxIcon.className  = 'bi ' + (btn.getAttribute('data-icon') || 'bi-info-circle');
      if (ctxDiv)  ctxDiv.classList.add('is-visible');
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   07. FORMULÁRIO RESERVA → WHATSAPP
       Constrói mensagem estruturada e abre WhatsApp.
       O staff recebe: Nome · Contacto · Serviço · Data · Hora · Convidado

       ELEMENTOS HTML necessários:
         <form id="formReserva">
           <input id="nome">   input text, required
           <input id="tel">    input tel, required
           <input id="data">   input date, required
           <select id="hora">
           <select id="convidado">
           <textarea id="notas">
           <input type="checkbox" id="rgpd" required>
           <button id="btnReservar" type="submit">
         </form>
   ───────────────────────────────────────────────────────────────── */
(function reservaWhatsApp() {
  var form = document.getElementById('formReserva');
  var btn  = document.getElementById('btnReservar');
  if (!form || !btn) return;

  /* Define data mínima = amanhã */
  var campoData = document.getElementById('data');
  if (campoData) {
    var amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    campoData.setAttribute('min', amanha.toISOString().split('T')[0]);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.classList.add('was-validated');

    /* Validação nativa HTML5 — WCAG 3.3.1 */
    if (!form.checkValidity()) {
      var primeiroInvalido = form.querySelector(':invalid');
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    /* Ler valores dos campos */
    var nome      = (document.getElementById('nome')      ? document.getElementById('nome').value      : '').trim();
    var tel       = (document.getElementById('tel')       ? document.getElementById('tel').value       : '').trim();
    var data      = (document.getElementById('data')      ? document.getElementById('data').value      : '');
    var hora      = (document.getElementById('hora')      ? document.getElementById('hora').value      : '') || 'Sem prefer\u00eancia';
    var convidado = (document.getElementById('convidado') ? document.getElementById('convidado').value : '') || 'N\u00e3o';
    var notas     = (document.getElementById('notas')     ? document.getElementById('notas').value     : '').trim();

    /* Serviço seleccionado pelo seletor visual */
    var btnActivo = document.querySelector('#srvSelector .srv-sel-btn.active');
    var servico   = btnActivo ? (btnActivo.getAttribute('data-tipo') || '') : 'N\u00e3o especificado';

    /* Formatar data em pt-PT */
    var dataFormatada = data;
    if (data) {
      try {
        var d = new Date(data + 'T00:00:00');
        dataFormatada = d.toLocaleDateString('pt-PT', {
          weekday: 'long', day: 'numeric',
          month: 'long', year: 'numeric'
        });
      } catch (_) { /* manter data original */ }
    }

    /* Construir mensagem estruturada (markdown do WhatsApp) */
    var linhas = [
      '\uD83C\uDFCB\uFE0F *NOVA RESERVA \u2014 Wave Studio*',
      '',
      '\uD83D\uDC64 *Nome:* '     + nome,
      '\uD83D\uDCDE *Contacto:* ' + tel,
      '\uD83C\uDFAF *Servi\u00e7o:* ' + servico,
      '\uD83D\uDCC5 *Data:* '     + dataFormatada,
      '\uD83D\uDD50 *Hora:* '     + hora,
      '\uD83D\uDC65 *Convidado:* ' + convidado
    ];
    if (notas) {
      linhas.push('\uD83D\uDCDD *Notas:* ' + notas);
    }
    linhas.push('', '\u2705 _1.\u00aa sess\u00e3o gratuita \u00b7 Aguardo confirma\u00e7\u00e3o_');

    var mensagem = linhas.join('\n');
    var waURL    = 'https://wa.me/351966201175?text=' + encodeURIComponent(mensagem);

    /* UX: estado de carregamento no botão */
    btn.disabled    = true;
    btn.innerHTML   =
      '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' +
      'A abrir WhatsApp\u2026';

    /* Abrir WhatsApp após breve delay para dar feedback visual */
    setTimeout(function() {
      window.open(waURL, '_blank', 'noopener,noreferrer');

      /* Repor botão */
      btn.disabled  = false;
      btn.innerHTML =
        '<i class="bi bi-whatsapp" aria-hidden="true"></i> Enviar Reserva via WhatsApp';

      /* Mostrar mensagem de sucesso inline */
      var sucesso   = document.createElement('div');
      sucesso.setAttribute('role', 'status');
      sucesso.setAttribute('aria-live', 'polite');
      sucesso.className = 'form-success';
      sucesso.innerHTML =
        '<i class="bi bi-check-circle-fill form-success__icon" aria-hidden="true"></i>' +
        '<h3 class="form-success__title">WhatsApp aberto! \uD83D\uDCAA</h3>' +
        '<p class="form-success__text">A mensagem de reserva foi preparada. ' +
        'Envia-a no WhatsApp para confirmar com a equipa.</p>' +
        '<a href="' + waURL + '" target="_blank" rel="noopener noreferrer" ' +
        'class="btn btn-wa btn-md mt-3">' +
        '<i class="bi bi-whatsapp" aria-hidden="true"></i> Reabrir WhatsApp</a>';

      form.insertAdjacentElement('afterend', sucesso);
      form.hidden = true;

      /* Tracking de conversão */
      pushConversao('reserva_whatsapp', {
        event_category: 'formulario',
        event_label:    'reserva_via_whatsapp',
        servico:        servico
      });
    }, 600);
  });
})();


/* ─────────────────────────────────────────────────────────────────
   08. LIGHTBOX — Galeria de imagens
       Selector: .galeria-item (cada item da galeria)
       IDs: lightbox, lightbox-img (imagem), lightbox-caption
       Classes de botões: .lightbox__btn.lightbox__close/prev/next
       Classe de abertura: .is-open
   ───────────────────────────────────────────────────────────────── */
(function lightbox() {
  var items = document.querySelectorAll('.galeria-item');
  var box   = document.getElementById('lightbox');
  if (!box || !items.length) return;

  var imgEl  = box.querySelector('.lightbox__img');
  var capEl  = box.querySelector('.lightbox__caption');
  var btnClose = box.querySelector('.lightbox__close');
  var btnPrev  = box.querySelector('.lightbox__prev');
  var btnNext  = box.querySelector('.lightbox__next');

  /* Colecionar todas as imagens para navegação */
  var imagens = Array.from(items).map(function(item) {
    var img = item.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });
  var idxActual = 0;

  function abrir(idx) {
    idxActual = idx;
    if (imgEl) { imgEl.src = imagens[idx].src; imgEl.alt = imagens[idx].alt; }
    if (capEl)  capEl.textContent = imagens[idx].alt;
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (btnClose) btnClose.focus();
  }

  function fechar() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function anterior() { abrir((idxActual - 1 + imagens.length) % imagens.length); }
  function seguinte()  { abrir((idxActual + 1) % imagens.length); }

  /* Clique em cada item */
  items.forEach(function(item, i) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Abrir imagem em tamanho completo');
    item.addEventListener('click', function() { abrir(i); });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(i); }
    });
  });

  /* Botões do lightbox */
  if (btnClose) btnClose.addEventListener('click', fechar);
  if (btnPrev)  btnPrev.addEventListener('click', anterior);
  if (btnNext)  btnNext.addEventListener('click', seguinte);

  /* Fechar ao clicar no backdrop */
  box.addEventListener('click', function(e) { if (e.target === box) fechar(); });

  /* Teclado */
  document.addEventListener('keydown', function(e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape')     fechar();
    if (e.key === 'ArrowLeft')  anterior();
    if (e.key === 'ArrowRight') seguinte();
  });
})();


/* ─────────────────────────────────────────────────────────────────
   09. COOKIES RGPD
   ─────────────────────────────────────────────────────────────────
   localStorage key: "wsf_cookies"
   Valores: "aceite" | "essenciais"
   ID do banner: "bannerCookies"

   RGPD art. 7.º: cookies analíticos SÓ activados após consentimento.
   ───────────────────────────────────────────────────────────────── */
(function cookiesRGPD() {
  var banner = document.getElementById('bannerCookies');
  if (!banner) return;

  /* Se o utilizador já decidiu, esconder o banner */
  if (localStorage.getItem('wsf_cookies')) {
    banner.setAttribute('hidden', '');
    return;
  }

  /* Primeira visita: mostrar o banner */
  banner.removeAttribute('hidden');
})();

/* Aceitar todos os cookies — chamado pelo botão HTML */
function aceitarCookies() {
  localStorage.setItem('wsf_cookies', 'aceite');
  var banner = document.getElementById('bannerCookies');
  if (banner) banner.setAttribute('hidden', '');

  /*
    ✏️  Activar GA4 aqui se configurado (Consent Mode v2):
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage':        'granted'
      });
    }
  */
  pushConversao('cookies_aceites', { modo: 'todos' });
}

/* Apenas cookies essenciais — chamado pelo botão HTML */
function recusarCookies() {
  localStorage.setItem('wsf_cookies', 'essenciais');
  var banner = document.getElementById('bannerCookies');
  if (banner) banner.setAttribute('hidden', '');
  /* NÃO activar analytics — exigência RGPD */
}


/* ─────────────────────────────────────────────────────────────────
   10. GTM DATALAYER — Helper de eventos de conversão
   ─────────────────────────────────────────────────────────────────
   Compatível com GTM DataLayer e gtag() directo (GA4 sem GTM).

   Eventos a configurar no GTM:
     - reserva_whatsapp  → conversão principal
     - cookies_aceites   → consentimento
     - cta_click         → clique em CTAs
     - whatsapp_click    → botão flutuante
   ───────────────────────────────────────────────────────────────── */
function pushConversao(eventName, params) {
  /* GTM DataLayer */
  if (window.dataLayer && typeof window.dataLayer.push === 'function') {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }
  /* GA4 directo */
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params || {});
  }
}
