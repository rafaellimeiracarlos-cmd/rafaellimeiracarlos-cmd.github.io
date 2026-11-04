'use strict';
const config = window.PORTFOLIO || {};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const asText = value => String(value ?? '');
const validHttp = url => { try {const u = new URL(url); return ['https:', 'http:'].includes(u.protocol) ? u.href : '';} catch {return '';} };
const contactMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
$$('[data-field]').forEach(el => { const value = config[el.dataset.field]; if (typeof value === 'string' && value.trim()) el.textContent = value; });
document.title = `${config.nome || 'Portfólio'} | ${config.cargo || 'Desenvolvedor de Software'}`;
$('#year').textContent = new Date().getFullYear();
const nav = $('#menu'); const toggle = $('#menuToggle');
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
$$('.menu a').forEach(link => link.addEventListener('click', () => {nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu');}));
const projectGrid = $('#projectGrid');
function renderProjects(filter = 'todos') {
  projectGrid.replaceChildren();
  const projects = (Array.isArray(config.projetos) ? config.projetos : []).filter(p => filter === 'todos' || p.categoria === filter);
  if (!projects.length) { const p = document.createElement('p'); p.textContent = 'Nenhum projeto nesta categoria.'; projectGrid.append(p); return; }
  projects.forEach((project, i) => {
    const article = document.createElement('article'); article.className = 'project-card';
    const visual = document.createElement('div'); visual.className = `project-visual visual-${project.categoria || 'web'}`;
    const device = document.createElement('div'); device.className = 'project-device';
    const label = document.createElement('span'); label.textContent = project.categoria === 'mobile' ? 'APP' : project.categoria === 'sistemas' ? 'SYS' : 'WEB';
    const bars = document.createElement('div'); bars.className = 'device-bars'; for(let n=0;n<4;n++){bars.append(document.createElement('i'));}
    device.append(label,bars); visual.append(device);
    const content = document.createElement('div'); content.className = 'project-content';
    const kicker = document.createElement('span'); kicker.className = 'project-kicker'; kicker.textContent = project.tipo || 'Projeto';
    const title = document.createElement('h3'); title.textContent = project.titulo || 'Projeto';
    const description = document.createElement('p'); description.textContent = project.descricao || '';
    const tags = document.createElement('div'); tags.className = 'project-tags';
    (Array.isArray(project.tecnologias) ? project.tecnologias : []).forEach(tag => {const s=document.createElement('span');s.textContent=tag;tags.append(s)});
    content.append(kicker,title,description,tags);
    const href = validHttp(project.link || '');
    if (href) { const a=document.createElement('a'); a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.className='inline-link';a.textContent='Ver projeto ↗';content.append(a); }
    else { const note=document.createElement('span');note.className='project-note';note.textContent='Link a adicionar';content.append(note); }
    article.append(visual,content);projectGrid.append(article);
  });
}
renderProjects();
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { $$('[data-filter]').forEach(b => {b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');renderProjects(button.dataset.filter); }));
const skillsList = $('#skillsList');(Array.isArray(config.habilidades) ? config.habilidades : []).forEach(skill => {const span=document.createElement('span');span.textContent=skill;skillsList.append(span)});
const contacts = $('#contactLinks');
const addContact = (label, href) => {const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}contacts.append(a)};
if (contactMail) addContact('✉ E-mail', `mailto:${contactMail}`);
if (/^\d{10,15}$/.test(config.whatsapp || '')) addContact('◉ WhatsApp', `https://wa.me/${config.whatsapp}`);
for (const [key,label] of [['github','⌘ GitHub'],['linkedin','▣ LinkedIn']]) {const url=validHttp(config[key] || '');if(url)addContact(label,url);}
const cv=validHttp(config.curriculo || '') || (/^(?!\/|\.\.\/)[\w./-]+\.pdf$/i.test(config.curriculo || '') ? config.curriculo : '');if(cv)addContact('↓ Baixar currículo',cv);
if (!contacts.childElementCount) { const span=document.createElement('span');span.className='contact-placeholder';span.textContent='Links de contato aparecerão aqui após preencher config.js.';contacts.append(span); }
$('#contactForm').addEventListener('submit', event => {event.preventDefault();const feedback=$('#formFeedback');if(!contactMail){feedback.textContent='Adicione seu e-mail em config.js para ativar este formulário.';return;}
  const form=event.currentTarget; if(!form.reportValidity())return;
  const name=$('#nomeContato').value.trim();const email=$('#emailContato').value.trim();const msg=$('#mensagemContato').value.trim();
  const subject=encodeURIComponent(`Contato pelo portfólio — ${name}`);const body=encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${msg}`);
  feedback.textContent='Seu aplicativo de e-mail será aberto. Confira a mensagem e clique em enviar.';
  window.location.href=`mailto:${contactMail}?subject=${subject}&body=${body}`;
});
