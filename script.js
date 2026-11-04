'use strict';

const app = window.PORTFOLIO || {};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const validUrl = value => {
  try { const url = new URL(String(value || '')); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''; }
  catch { return ''; }
};
const localFile = value => typeof value === 'string' && /^(?!\/|\.{1,2}\/)(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9._-]+\.(?:png|jpg|jpeg|webp|svg|pdf)$/i.test(value) ? value : '';
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email || '') ? app.email : '';

// Texto alterado sem modificar o layout e sem inserir HTML arbitrário.
$$('[data-field]').forEach(element => {
  const value = app[element.dataset.field];
  if (typeof value === 'string' && value.trim()) element.textContent = value.trim();
});
document.title = `${app.nome || 'Rafael Limeira Carlos'} | ${app.cargo || 'Desenvolvedor de Software'}`;
$('#year').textContent = String(new Date().getFullYear());
const github = validUrl(app.github);
if (github) $$('[data-contact="github"]').forEach(link => { link.href = github; });

// Navegação responsiva.
const menu = $('#navLinks');
const menuToggle = $('#menuToggle');
const closeMenu = () => {
  menu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir navegação');
};
menuToggle.addEventListener('click', () => {
  const opened = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Fechar navegação' : 'Abrir navegação');
});
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (menu.classList.contains('open') && !event.target.closest('.site-header')) closeMenu();
});

// Barra de rolagem e botão de voltar.
const progress = $('#readingProgress');
const backTop = $('#backTop');
let scrollFrame = false;
const updateScroll = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = `${Math.min(100, window.scrollY / max * 100)}%`;
  backTop.classList.toggle('visible', window.scrollY > 560);
  scrollFrame = false;
};
window.addEventListener('scroll', () => {
  if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateScroll); }
}, { passive:true });
window.addEventListener('resize', updateScroll, { passive:true });
updateScroll();

// Entrada suave ao rolar; nada fica escondido caso o navegador não ofereça IntersectionObserver.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin:'0px 0px -30px 0px', threshold:.1 });
  $$('.reveal').forEach(el => observer.observe(el));
}

// Parallax sutil apenas em aparelhos com mouse e sem preferências de movimento reduzido.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const stage = $('#heroStage');
  stage.addEventListener('pointermove', event => {
    const r = stage.getBoundingClientRect();
    const x = ((event.clientX - r.left) / r.width - .5) * 13;
    const y = ((event.clientY - r.top) / r.height - .5) * 10;
    stage.style.setProperty('--mx', `${x.toFixed(1)}px`);
    stage.style.setProperty('--my', `${y.toFixed(1)}px`);
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--mx', '0px');
    stage.style.setProperty('--my', '0px');
  });
}

// Demonstração realmente interativa da responsividade.
const lab = $('#labDevice');
const labLabel = $('#labViewportLabel');
const deviceNames = { desktop:'DESKTOP', tablet:'TABLET', mobile:'MOBILE' };
$$('.device-switch').forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.device;
  if (!Object.hasOwn(deviceNames, selected)) return;
  lab.className = `lab-device ${selected}`;
  labLabel.textContent = deviceNames[selected];
  $$('.device-switch').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
}));

// Projetos: aceita screenshots reais quando você adicioná-las, usando uma arte de exemplo nos demais.
const projectGrid = $('#projectGrid');
const projectCategories = new Set(['mobile', 'web', 'sistemas']);
function el(name, className, text) {
  const element = document.createElement(name);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = String(text);
  return element;
}
function mockProjectImage(project, category) {
  const frame = el('div', 'project-frame');
  const header = el('div', 'frame-header');
  for (let i=0; i<3; i++) header.append(el('i'));
  const body = el('div', 'frame-body');
  body.append(el('strong', '', project.destaque || project.titulo || 'Projeto'));
  body.append(el('span'));
  const boxes = el('div', 'frame-boxes');
  boxes.append(el('i'), el('i'));
  body.append(boxes);
  frame.append(header, body);
  return frame;
}
function renderProjects(filter='todos') {
  projectGrid.replaceChildren();
  const list = (Array.isArray(app.projetos) ? app.projetos : []).filter(project => filter === 'todos' || project.categoria === filter);
  if (!list.length) { projectGrid.append(el('p', 'empty-projects', 'Ainda não há projetos nesta categoria.')); return; }
  for (const project of list) {
    const category = projectCategories.has(project.categoria) ? project.categoria : 'web';
    const article = el('article', 'project-card');
    const visual = el('div', `project-visual visual-${category}`);
    const imagePath = localFile(project.imagem) || validUrl(project.imagem);
    const tag = el('span', 'project-visual-tag', project.imagem ? 'PROJETO' : 'CAPA ILUSTRATIVA');
    if (imagePath) {
      const img = el('img', 'project-screenshot');
      img.src = imagePath;
      img.loading = 'lazy';
      img.alt = `Captura de tela do projeto ${project.titulo || ''}`;
      img.addEventListener('error', () => { img.replaceWith(mockProjectImage(project, category)); tag.textContent = 'CAPA ILUSTRATIVA'; }, { once:true });
      visual.append(img);
    } else { visual.append(mockProjectImage(project, category)); }
    visual.append(tag);
    const content = el('div','project-content');
    const type = el('span', 'project-type', project.tipo || 'PROJETO');
    const title = el('h3', '', project.titulo || 'Projeto');
    const desc = el('p', '', project.descricao || 'Veja mais sobre este projeto.');
    const tags = el('div', 'project-tags');
    (Array.isArray(project.tecnologias) ? project.tecnologias : []).forEach(value => tags.append(el('span','',value)));
    content.append(type, title, desc, tags);
    const href = validUrl(project.link);
    if (href) {
      const link = el('a', 'project-link');
      link.href=href; link.target='_blank'; link.rel='noopener noreferrer';
      link.append(el('span','','Ver código no GitHub'), el('span','','↗'));
      link.setAttribute('aria-label', `Ver repositório ${project.titulo || ''} no GitHub`);
      content.append(link);
    } else content.append(el('span','project-type','PROJETO EM DESENVOLVIMENTO'));
    article.append(visual, content);
    projectGrid.append(article);
  }
}
renderProjects();
$$('.filter-button').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('.filter-button').forEach(other => {
    const active = button === other;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  renderProjects(filter);
}));

// Competências configuradas pelo usuário.
const skillsList = $('#skillsList');
(Array.isArray(app.habilidades) ? app.habilidades : []).forEach(skill => skillsList.append(el('span', '', skill)));

// Mostrar contatos APENAS quando houver um destino válido.
const contactLinks = $('#contactLinks');
function addContact(label, href, external=false) {
  const a = el('a', '', `${label} ↗`);
  a.href = href;
  if (external) { a.target='_blank'; a.rel='noopener noreferrer'; }
  contactLinks.append(a);
}
if (email) addContact('✉ E-mail', `mailto:${email}`);
if (/^\d{10,15}$/.test(app.whatsapp || '')) addContact('◉ WhatsApp', `https://wa.me/${app.whatsapp}`, true);
if (github) addContact('⌘ GitHub', github, true);
const linkedin = validUrl(app.linkedin);
if (linkedin) addContact('▣ LinkedIn', linkedin, true);
const cv = validUrl(app.curriculo) || localFile(app.curriculo);
if (cv && /\.pdf(?:$|\?)/i.test(cv)) addContact('↓ Currículo em PDF', cv, cv.startsWith('http'));
if (!contactLinks.childElementCount) contactLinks.append(el('p', 'contact-note', 'Preencha seus links de contato no arquivo config.js.'));

// O GitHub Pages é estático. Este formulário só prepara um e-mail no programa do visitante.
$('#contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const feedback = $('#formFeedback');
  if (!email) { feedback.textContent = 'Preencha o campo email em config.js para ativar o botão.'; return; }
  if (!event.currentTarget.reportValidity()) return;
  const name = $('#nomeContato').value.trim();
  const sender = $('#emailContato').value.trim();
  const message = $('#mensagemContato').value.trim();
  if (!name || !sender || !message) return;
  const subject = encodeURIComponent(`Contato pelo portfólio - ${name}`);
  const body = encodeURIComponent(`Olá, Rafael!\n\nMeu nome: ${name}\nMeu e-mail: ${sender}\n\n${message}`);
  feedback.textContent = 'Abrindo seu aplicativo de e-mail. Revise a mensagem e clique em Enviar.';
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
