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

// Retorno ao topo: funciona também quando a URL já contém #inicio.
// Usa rolagem direta no documento e respeita a preferência de movimento reduzido.
const goToTop = event => {
  event.preventDefault();
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTo({ top: 0, left: 0, behavior });
  // Evita que o histórico acumule cliques e mantém a URL limpa.
  if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
};
document.querySelectorAll('[data-scroll-top]').forEach(link => link.addEventListener('click', goToTop));

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

// Demonstração funcional: site, tablet, Android e iPhone.
const lab = $('#labDevice');
const labLabel = $('#labViewportLabel');
const demoFrame = $('#demoFrame');
const demoSpace = $('#labFrameSpace');
const deviceNames = { desktop:'WEB', tablet:'TABLET', android:'ANDROID', ios:'iOS' };
let currentDevice = 'desktop';
function resizeDemo() {
  const mobile = currentDevice === 'android' || currentDevice === 'ios';
  const frameWidth = mobile ? 390 : currentDevice === 'tablet' ? 740 : 1050;
  const frameHeight = mobile ? 830 : currentDevice === 'tablet' ? 770 : 710;
  const scale = Math.min(demoSpace.clientWidth / frameWidth, demoSpace.clientHeight / frameHeight);
  demoFrame.style.width = `${frameWidth}px`;
  demoFrame.style.height = `${frameHeight}px`;
  demoFrame.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
function setDemoDevice(selected) {
  if (!Object.hasOwn(deviceNames, selected)) return;
  currentDevice = selected;
  lab.className = `lab-device ${selected}`;
  labLabel.textContent = deviceNames[selected];
  $$('.device-switch').forEach(button => {
    const active = button.dataset.device === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (demoFrame.contentWindow) demoFrame.contentWindow.postMessage({type:'rafael-platform',platform:selected === 'desktop' ? 'web' : selected}, '*');
  requestAnimationFrame(resizeDemo);
  setTimeout(resizeDemo, 580);
}
$$('.device-switch').forEach(button => button.addEventListener('click', () => setDemoDevice(button.dataset.device)));
demoFrame.addEventListener('load', () => setDemoDevice(currentDevice));
if ('ResizeObserver' in window) new ResizeObserver(resizeDemo).observe(demoSpace);
window.addEventListener('resize', resizeDemo);
resizeDemo();
$('#demoReset').addEventListener('click', () => {
  try { demoFrame.contentWindow.localStorage.removeItem('rafael_demo_v7'); } catch(error) {}
  demoFrame.src = `demo.html?reset=${Date.now()}`;
  setDemoDevice('desktop');
});

// Projetos: aceita screenshots reais quando você adicioná-las, usando uma arte de exemplo nos demais.
const projectGrid = $('#projectGrid');
const projectCategories = new Set(['mobile', 'web', 'sistemas']);
const projectDialog = $('#projectDialog');
const allProjectsCount = $('#allProjectsCount');
if (allProjectsCount) allProjectsCount.textContent = String(Array.isArray(app.projetos) ? app.projetos.length : 0);
$('#closeProjectDialog').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });
function openProject(project) {
  $('#projectDialogTitle').textContent = project.titulo || 'Projeto';
  $('#projectDialogDescription').textContent = project.descricao || 'Conheça este projeto no repositório.';
  $('#projectDialogCategory').textContent = project.destaque || project.tipo || 'Desenvolvimento';
  $('#projectDialogTags').replaceChildren(...(Array.isArray(project.tecnologias) ? project.tecnologias : []).map(value => el('span','',value)));
  const link = $('#projectDialogLink'); const href = validUrl(project.link); link.hidden = !href; if (href) link.href = href;
  if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
}
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
    const tag = el('span', 'project-visual-tag', project.imagem ? 'CAPTURA DO PROJETO' : 'CONCEITO VISUAL');
    if (imagePath) {
      const img = el('img', 'project-screenshot');
      img.src = imagePath;
      img.loading = 'lazy';
      img.alt = `Captura de tela do projeto ${project.titulo || ''}`;
      img.addEventListener('error', () => { img.replaceWith(mockProjectImage(project, category)); tag.textContent = 'CONCEITO VISUAL'; }, { once:true });
      visual.append(img);
    } else { visual.append(mockProjectImage(project, category)); }
    visual.append(tag);
    const content = el('div','project-content');
    const type = el('span', 'project-type', project.tipo || 'PROJETO');
    const title = el('h3', '', project.titulo || 'Projeto');
    const desc = el('p', '', project.descricao || 'Veja mais sobre este projeto.');
    const tags = el('div', 'project-tags');
    (Array.isArray(project.tecnologias) ? project.tecnologias : []).forEach(value => tags.append(el('span','',value)));
    const details = el('button', 'project-details', 'Conhecer projeto ↗'); details.type='button'; details.addEventListener('click', () => openProject(project));
    content.append(type, title, desc, tags, details);
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

// Painel interativo de competências; a lista vem do config.js.
const availableSkills = Array.isArray(app.habilidades) ? app.habilidades : [];
const skillsList = $('#skillsList');
const countEl = $('#skillsCount');
if (countEl) countEl.textContent = String(availableSkills.length).padStart(2, '0');
const skillGroups = {
  mobile: {icon:'◈', eyebrow:'ÁREA 01 / 03', title:'Desenvolvimento Mobile', description:'Aplicativos Android e interfaces pensadas para uma experiência intuitiva no celular.', application:'Aplicativos Android, telas responsivas e fluxos de navegação.', keywords:['Kotlin','Java','Android'], fallback:['Kotlin','Android']},
  web: {icon:'⌘', eyebrow:'ÁREA 02 / 03', title:'Experiências Web', description:'Páginas responsivas, componentes interativos e interfaces que se adaptam a diferentes dispositivos.', application:'Sites, portfólios interativos e interfaces para sistemas web.', keywords:['HTML5','CSS3','JavaScript','Design responsivo'], fallback:['HTML5','CSS3']},
  sistemas: {icon:'▤', eyebrow:'ÁREA 03 / 03', title:'Sistemas & Engenharia', description:'Organização de soluções digitais, lógica de programação e ferramentas para transformar processos em software.', application:'Sistemas de gestão, versionamento de código e organização de projetos.', keywords:['Git','GitHub','Lógica de programação','Análise de Sistemas','Sistemas de Gestão'], fallback:['Git','GitHub']}
};
function showSkillGroup(key, focusTab=false) {
  const group = skillGroups[key]; if (!group) return;
  const panel = $('#skillDetail');
  $$('.skills-tab').forEach(button => {
    const selected = button.dataset.skillGroup === key;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected) {panel.setAttribute('aria-labelledby', button.id); if (focusTab) button.focus();}
  });
  $('#skillBadge').textContent = group.icon;
  $('#skillEyebrow').textContent = group.eyebrow;
  $('#skillTitle').textContent = group.title;
  $('#skillDescription').textContent = group.description;
  $('#skillApplication').textContent = group.application;
  skillsList.replaceChildren();
  const matching = availableSkills.filter(skill => group.keywords.some(keyword => skill.toLocaleLowerCase('pt-BR') === keyword.toLocaleLowerCase('pt-BR')));
  (matching.length ? matching : availableSkills.slice(0, 4)).forEach((skill, index) => {
    const chip = el('span', 'skill-chip', skill);
    chip.style.setProperty('--chip-delay', `${index * 55}ms`);
    skillsList.append(chip);
  });
  panel.classList.remove('skill-panel-enter');
  void panel.offsetWidth;
  panel.classList.add('skill-panel-enter');
}
$$('.skills-tab').forEach(button => {
  button.addEventListener('click', () => showSkillGroup(button.dataset.skillGroup));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$('.skills-tab');
    const idx = tabs.indexOf(button);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (idx + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    showSkillGroup(tabs[next].dataset.skillGroup, true);
  });
});
showSkillGroup('mobile');

// Mostrar contatos APENAS quando houver um destino válido.
const contactLinks = $('#contactLinks');
function addContact(label, href, external=false) {
  const a = el('a', 'contact-button', '');
  const symbol = el('span', 'contact-button-icon', label.split(' ')[0]);
  const title = el('span', 'contact-button-label', label.substring(label.indexOf(' ') + 1));
  const arrow = el('span', 'contact-button-arrow', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  a.append(symbol, title, arrow);
  a.setAttribute('aria-label', label.substring(label.indexOf(' ') + 1));
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
