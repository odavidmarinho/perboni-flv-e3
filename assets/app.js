'use strict';

// Dados demonstrativos mantidos iguais aos da E2. Não representam estoque real.
const PRODUCTS = [
  { id: 'tomate', name: 'Tomate', category: 'Legumes', unit: 'kg', stock: 20, image: 'tomate.jpg', alt: 'Tomates vermelhos maduros em um ramo' },
  { id: 'banana', name: 'Banana-prata', category: 'Frutas', unit: 'kg', stock: 30, image: 'banana.jpg', alt: 'Cacho de bananas amarelas; imagem ilustrativa da categoria' },
  { id: 'alface', name: 'Alface', category: 'Verduras', unit: 'un', stock: 15, image: 'alface.jpg', alt: 'Folhas verdes de alface crespa' }
];
const KEY = 'perboni-e3-v1';
const page = document.body.dataset.page;
const screen = document.getElementById('screen');
let storageAvailable = true;
const initialState = () => ({ version: 1, qty: { tomate: 0, banana: 0, alface: 0 }, stock: { tomate: 20, banana: 30, alface: 15 }, physical: {}, status: 'draft', losses: [] });
const integer = value => Number.isSafeInteger(value) && value >= 0 && value <= 99999;

// Valida o armazenamento antes de usá-lo. Conteúdo variável entra no DOM por textContent.
function validState(s) {
  return s && s.version === 1 && ['draft', 'pending', 'verified', 'confirmed', 'cancelled'].includes(s.status)
    && PRODUCTS.every(p => integer(s.qty?.[p.id]) && integer(s.stock?.[p.id]) && s.stock[p.id] <= p.stock)
    && s.physical && PRODUCTS.every(p => s.physical[p.id] === undefined || integer(s.physical[p.id]))
    && (!['verified', 'confirmed'].includes(s.status) || PRODUCTS.filter(p => s.qty[p.id] > 0).every(p => integer(s.physical[p.id])))
    && (s.status === 'draft' || PRODUCTS.some(p => s.qty[p.id] > 0))
    && Array.isArray(s.losses) && s.losses.every(l => PRODUCTS.some(p => p.id === l.id) && integer(l.n) && l.n > 0 && typeof l.reason === 'string');
}
function load() {
  try { const raw = sessionStorage.getItem(KEY); if (!raw) return initialState(); const s = JSON.parse(raw); return validState(s) ? s : initialState(); }
  catch { storageAvailable = false; return initialState(); }
}
let state = load();
function save() {
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; showStorageWarning(); }
}
function showStorageWarning() {
  if (!storageAvailable) {
    const box = document.getElementById('storage-warning');
    box.hidden = false;
    box.textContent = 'O navegador bloqueou o armazenamento da sessão. Ative-o e abra o projeto pelo servidor local descrito no README para preservar o pedido entre páginas.';
  }
}
const selected = () => PRODUCTS.filter(p => state.qty[p.id] > 0);
const attended = p => Math.min(state.qty[p.id], state.physical[p.id] ?? 0);
const active = () => ['pending', 'verified'].includes(state.status);
const labels = { draft: 'Pedido em montagem', pending: 'Aguardando contagem física', verified: 'Disponibilidade verificada', confirmed: 'Pedido confirmado', cancelled: 'Pedido cancelado' };
const action = (text, name, kind = '', disabled = false) => `<button type="button" class="button ${kind}" data-action="${name}" ${disabled ? 'disabled' : ''}>${text}</button>`;
const link = (text, href, kind = '') => `<a class="button ${kind}" href="${href}">${text}</a>`;
const errorBox = () => '<p id="error" class="error" role="alert"></p>';
function announce(text) { document.getElementById('live-message').textContent = text; }
function error(text) { const el = document.getElementById('error'); if (el) el.textContent = text; announce(text); }
function flow(current) {
  return `<ol class="flow" aria-label="Etapas do pedido">${['Montar pedido', 'Conferir estoque', 'Revisar e confirmar'].map((s, i) => `<li ${i === current ? 'aria-current="step"' : ''}><b aria-hidden="true">${i + 1}</b>${s}</li>`).join('')}</ol>`;
}
function intro(title, text, compact = true) {
  return `<div class="intro ${compact ? 'compact' : ''}"><div><h1>${title}</h1><p>${text}</p></div><span class="badge-state">${labels[state.status]}</span></div>`;
}
function table() {
  const verified = ['verified', 'confirmed'].includes(state.status);
  return `<div class="table-wrap"><table><caption>Itens do pedido</caption><thead><tr><th scope="col">Produto</th><th scope="col">Solicitado</th><th scope="col">Atendido</th></tr></thead><tbody>${selected().map(p => `<tr><th scope="row">${p.name}</th><td>${state.qty[p.id]} ${p.unit}</td><td class="${verified && attended(p) < state.qty[p.id] ? 'diff' : ''}">${verified ? `${attended(p)} ${p.unit}` : 'A verificar'}</td></tr>`).join('')}</tbody></table></div>`;
}
function empty(title, text, href = 'index.html', label = 'Montar pedido') {
  return `<section class="panel empty"><h2>${title}</h2><p>${text}</p>${link(label, href)}</section>`;
}
function renderCatalog() {
  if (state.status !== 'draft') {
    screen.innerHTML = intro('Catálogo de produtos', 'Seu pedido permanece disponível para consulta. Reinicie a demonstração para montar uma nova lista.', false)
      + empty(labels[state.status], 'Consulte as quantidades e a etapa atual do atendimento.', 'acompanhamento.html', 'Acompanhar pedido');
    return;
  }
  screen.innerHTML = flow(0) + intro('Sua reposição começa aqui.', 'Escolha os produtos e informe as quantidades. A operação verifica a disponibilidade antes de você confirmar.', false)
    + `<div class="catalog-layout"><section aria-label="Produtos disponíveis"><div class="toolbar"><div class="search-field"><label for="busca">Buscar produto</label><input id="busca" type="search" placeholder="Digite o nome do produto" autocomplete="off"></div><div class="filter-field field"><label for="categoria">Categoria</label><select id="categoria"><option value="">Todas</option><option>Frutas</option><option>Legumes</option><option>Verduras</option></select></div></div><form id="catalog-form"><div class="product-grid">${PRODUCTS.map(p => `<article class="product" data-product="${p.id}"><img src="assets/${p.image}" alt="${p.alt}" width="700" height="466"><div class="product-info"><span class="product-category">${p.category} · ${p.unit === 'un' ? 'por unidade' : 'por quilo'}</span><h2>${p.name}</h2><p class="stock">Saldo informado: ${state.stock[p.id]} ${p.unit}</p><p class="small muted">Sujeito à conferência física</p><label class="quantity-label" for="q-${p.id}">Quantidade (${p.unit})</label><div class="quantity-control"><button type="button" data-step="-1" data-id="${p.id}" aria-label="Diminuir quantidade de ${p.name}">−</button><input id="q-${p.id}" name="${p.id}" type="number" min="0" max="99999" step="1" required value="${state.qty[p.id]}" data-qty="${p.id}"><button type="button" data-step="1" data-id="${p.id}" aria-label="Aumentar quantidade de ${p.name}">+</button></div></div></article>`).join('')}</div><p id="no-results" class="notice" hidden>Nenhum produto encontrado. Altere a busca ou a categoria.</p>${errorBox()}</form></section><aside class="summary" aria-labelledby="resumo-titulo"><h2 id="resumo-titulo">Sua lista de reposição</h2><div id="summary-items"></div><button type="submit" form="catalog-form" class="button">Revisar pedido <span aria-hidden="true">→</span></button><p class="small muted mt-3">O envio inicia a conferência.<br>A compra ainda não está confirmada.</p></aside></div><section class="help-panel" aria-label="Como funciona"><p><strong>Escolha com clareza</strong>Quantidades inteiras em kg ou unidades, conforme cada produto.</p><p><strong>Confirme com segurança</strong>Você vê o atendimento e aprova qualquer redução antes de concluir.</p></section>`;
  updateSummary();
}
function updateSummary() {
  const target = document.getElementById('summary-items'); if (!target) return;
  const items = selected();
  target.innerHTML = items.length ? `<ul>${items.map(p => `<li><span>${p.name}</span><strong>${state.qty[p.id]} ${p.unit}</strong></li>`).join('')}</ul>` : '<p class="muted">Sua lista está vazia. Adicione as quantidades ao lado.</p>';
  target.innerHTML += `<p class="summary-total"><span>Produtos selecionados</span><strong>${items.length}</strong></p>`;
}
function filterProducts() {
  const term = document.getElementById('busca').value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const category = document.getElementById('categoria').value;
  let count = 0;
  PRODUCTS.forEach(p => { const match = p.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(term) && (!category || category === p.category); document.querySelector(`[data-product="${p.id}"]`).hidden = !match; if (match) count++; });
  document.getElementById('no-results').hidden = count > 0;
  announce(`${count} produto${count === 1 ? '' : 's'} encontrado${count === 1 ? '' : 's'}. As quantidades selecionadas foram mantidas.`);
}
function renderOrder() {
  screen.innerHTML = flow(0) + intro('Revise sua lista.', 'O envio inicia a conferência física. Preços, pagamento e entrega estão fora deste protótipo.');
  if (!selected().length) { screen.innerHTML += empty('Seu pedido está vazio', 'Adicione ao menos um produto ao catálogo para continuar.'); return; }
  screen.innerHTML += `<section class="panel">${table()}${errorBox()}<div class="actions">${state.status === 'draft' ? link('Editar quantidades', 'index.html', 'secondary') + action('Enviar para verificação', 'send') : link('Acompanhar pedido', 'acompanhamento.html')}</div></section>`;
}
function renderTracking() {
  screen.innerHTML = flow(state.status === 'draft' ? 0 : state.status === 'pending' ? 1 : 2) + intro(labels[state.status], 'Acompanhe o que foi solicitado, o resultado da contagem e sua decisão sobre o atendimento.');
  if (state.status === 'draft') { screen.innerHTML += empty('Ainda não há pedido enviado', 'Monte sua lista e envie para a operação conferir o estoque.'); return; }
  let content = table();
  if (state.status === 'pending') content += `<div class="notice warning">Aguardando verificação física. O saldo informado no catálogo não é uma reserva de mercadoria.</div><div class="actions">${link('Ir à operação (demonstração)', 'operacao.html')}</div>`;
  if (state.status === 'verified') {
    const diffs = selected().filter(p => attended(p) < state.qty[p.id]);
    const any = selected().some(p => attended(p) > 0);
    content += `<section aria-labelledby="resultado"><h2 id="resultado" class="mt-4">${diffs.length ? 'Confira as alterações' : 'Atendimento integral'}</h2>${diffs.length ? diffs.map(p => `<p class="notice warning">${p.name}: faltam <strong>${state.qty[p.id] - attended(p)} ${p.unit}</strong>. Atendimento disponível: ${attended(p)} ${p.unit}.</p>`).join('') : '<p>Todos os itens solicitados estão disponíveis na contagem demonstrativa.</p>'}<p class="small muted">Nenhuma substituição é automática. Você decide sobre as quantidades apresentadas.</p></section>`;
    content += any ? `<form id="accept-form"><label class="accept" for="aceite"><input id="aceite" type="checkbox" required><span>Li e aceito as quantidades verificadas, incluindo eventuais reduções.</span></label>${errorBox()}<div class="actions"><button id="confirm" type="submit" class="button" disabled>Confirmar pedido</button></div></form>` : '<p class="notice warning">Nenhum item pode ser atendido. Solicite nova contagem ou cancele o pedido. A confirmação está bloqueada.</p>';
    content += `<div class="actions">${action('Solicitar nova contagem', 'recount', 'secondary')}${action('Cancelar pedido', 'cancel', 'danger')}</div>`;
  }
  if (state.status === 'confirmed') content += '<div class="notice success"><strong>Pedido confirmado · DEMO-001</strong><br>Disponibilidade verificada e aceite registrado. Esta é uma confirmação demonstrativa, sem compra, envio ou reserva de estoque real.</div>';
  if (state.status === 'cancelled') content += '<p class="notice">Pedido cancelado. Nenhuma compra foi confirmada. Reinicie a demonstração para começar outro pedido.</p>';
  screen.innerHTML += `<section class="panel">${content}</section>`;
}
function renderOperation() {
  screen.innerHTML = intro('Conferência e separação', 'Confira o estoque utilizável e registre perdas. A troca de perfil é apenas demonstrativa e não representa autenticação.')
    + `<div class="two-columns"><div><section class="panel"><h2>Pedido de demonstração</h2><p class="muted">${state.status === 'draft' ? 'Nenhum pedido recebido.' : labels[state.status]}</p>${active() ? `<form id="physical-form"><p class="small">Conte a mercadoria física. O atendimento será limitado ao solicitado. A contagem não altera o saldo do APP.</p>${selected().map(p => `<div class="count-row"><label for="physical-${p.id}">${p.name}<small>Solicitado: ${state.qty[p.id]} ${p.unit}</small></label><div class="field"><label for="physical-${p.id}" class="sr-only">Disponível fisicamente: ${p.name} (${p.unit})</label><input id="physical-${p.id}" name="${p.id}" type="number" min="0" max="99999" step="1" required value="${state.physical[p.id] ?? ''}" aria-describedby="unit-${p.id}"><span id="unit-${p.id}" class="hint">Disponível (${p.unit})</span></div></div>`).join('')}${errorBox()}<div class="actions"><button class="button" type="submit">Salvar verificação</button>${link('Ver resultado', 'acompanhamento.html', 'secondary')}</div></form>` : `<p class="small">${state.status === 'draft' ? 'O comprador precisa enviar um pedido antes da contagem.' : 'Este pedido está encerrado. A contagem não pode ser alterada.'}</p>${link('Abrir comprador', state.status === 'draft' ? 'index.html' : 'acompanhamento.html', 'secondary')}`}</section><section class="panel"><h2>Histórico de perdas da sessão</h2><div id="loss-history"></div><div class="actions">${link('Registrar perda', 'perdas.html', 'secondary')}</div></section></div><aside class="summary"><h2>Saldo demonstrativo</h2><ul class="stock-list">${PRODUCTS.map(p => `<li><span>${p.name}</span><strong>${state.stock[p.id]} ${p.unit}</strong></li>`).join('')}</ul><p class="small muted">Uma perda reduz este saldo local e exige nova contagem de pedidos pendentes.</p></aside></div>`;
  const history = document.getElementById('loss-history');
  if (!state.losses.length) { history.textContent = 'Nenhuma perda registrada.'; history.className = 'small muted'; }
  else {
    const list = document.createElement('ul'); list.className = 'history';
    [...state.losses].reverse().forEach(l => { const product = PRODUCTS.find(p => p.id === l.id); const li = document.createElement('li'); li.textContent = `${product.name}: ${l.n} ${product.unit}`; const note = document.createElement('span'); note.textContent = l.reason; li.append(note); list.append(li); }); history.append(list);
  }
}
function renderLoss() {
  screen.innerHTML = intro('Registrar perda', 'Mantenha o saldo demonstrativo coerente com os descartes. Nenhum sistema externo será alterado.')
    + `<div class="two-columns"><section class="panel"><h2>Dados do descarte</h2><form id="loss-form"><div class="form-grid"><div class="field"><label for="produto">Produto</label><select id="produto" name="produto" required>${PRODUCTS.map(p => `<option value="${p.id}">${p.name} · saldo ${state.stock[p.id]} ${p.unit}</option>`).join('')}</select></div><div class="field"><label for="quantidade">Quantidade perdida (<span id="loss-unit">kg</span>)</label><input id="quantidade" name="quantidade" type="number" min="1" step="1" max="${state.stock.tomate}" required aria-describedby="loss-hint"><span id="loss-hint" class="hint">Use uma quantidade inteira, positiva e até o saldo disponível.</span></div><div class="field"><label for="motivo">Motivo</label><select id="motivo" name="motivo" required><option value="">Selecione o motivo</option><option>Produto deteriorado</option><option>Dano na separação</option><option>Outro descarte</option></select></div></div>${errorBox()}<div class="actions"><button type="submit" class="button">Salvar perda</button>${link('Voltar à operação', 'operacao.html', 'secondary')}</div></form><div id="loss-result" role="status" hidden></div></section><aside><div class="alert alert-warning" role="note"><strong>Atenção à conferência</strong><br>Registrar uma perda invalida a verificação de qualquer pedido ainda não confirmado. A operação precisa contar novamente antes do aceite.</div><!-- Bootstrap: .alert.alert-warning. Equivalente CSS puro comentado em assets/style.css. --><p class="small muted">Este fluxo simula a baixa de perecíveis discutida na E1 e mantém a regra de segurança da E2.</p></aside></div>`;
}
function render(focus = false) {
  ({ catalogo: renderCatalog, pedido: renderOrder, acompanhamento: renderTracking, operacao: renderOperation, perdas: renderLoss })[page]();
  screen.classList.add('screen-enter');
  showStorageWarning();
  if (focus) { const h = screen.querySelector('h1'); h.tabIndex = -1; h.focus(); }
}
function changeQuantity(input) {
  if (!input.validity.valid || input.value === '') { input.setCustomValidity('Informe uma quantidade inteira entre 0 e 99999.'); error('Corrija a quantidade: use um número inteiro entre 0 e 99999.'); return false; }
  state.qty[input.dataset.qty] = Number(input.value); save(); updateSummary(); error(''); return true;
}
document.addEventListener('input', e => {
  if (e.target.matches('[data-qty]')) { e.target.setCustomValidity(''); changeQuantity(e.target); }
  if (e.target.id === 'busca') filterProducts();
  if (e.target.id === 'quantidade') e.target.setCustomValidity('');
  if (e.target.id === 'aceite') document.getElementById('confirm').disabled = !e.target.checked;
});
document.addEventListener('change', e => {
  if (e.target.id === 'categoria') filterProducts();
  if (e.target.id === 'produto') {
    const p = PRODUCTS.find(p => p.id === e.target.value);
    document.getElementById('loss-unit').textContent = p.unit;
    const input = document.getElementById('quantidade'); input.max = state.stock[p.id]; input.setCustomValidity('');
  }
});
document.addEventListener('invalid', e => {
  // Um filtro não pode esconder o campo que precisa ser corrigido.
  if (e.target.closest('.product')?.hidden) {
    document.getElementById('busca').value = '';
    document.getElementById('categoria').value = '';
    filterProducts();
  }
  if (e.target.closest('form')) error(e.target.validationMessage || 'Preencha os campos obrigatórios corretamente.');
}, true);
document.addEventListener('click', e => {
  const menu = e.target.closest('.menu-toggle');
  if (menu) { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); document.getElementById('navegacao').classList.toggle('is-open', open); }
  const step = e.target.closest('[data-step]');
  if (step && state.status === 'draft') {
    const input = document.getElementById(`q-${step.dataset.id}`);
    const current = Number(input.value); input.value = Math.min(99999, Math.max(0, (integer(current) ? current : 0) + Number(step.dataset.step))); input.setCustomValidity(''); changeQuantity(input); announce(`${PRODUCTS.find(p => p.id === step.dataset.id).name}: ${input.value}.`);
  }
  const button = e.target.closest('[data-action]'); if (!button) return;
  switch (button.dataset.action) {
    case 'reset':
      if (window.confirm('Reiniciar a demonstração? O pedido e as perdas desta sessão serão apagados.')) { state = initialState(); save(); window.location.href = 'index.html'; }
      break;
    case 'send':
      if (state.status !== 'draft' || !selected().length) { error('Adicione pelo menos um produto antes de enviar.'); return; }
      state.status = 'pending'; state.physical = {}; save(); window.location.href = 'acompanhamento.html'; break;
    case 'recount':
      if (state.status !== 'verified') return;
      state.status = 'pending'; state.physical = {}; save(); window.location.href = 'operacao.html'; break;
    case 'cancel':
      if (state.status !== 'verified') return;
      if (window.confirm('Cancelar este pedido? Nenhuma compra será confirmada.')) { state.status = 'cancelled'; save(); render(true); announce('Pedido cancelado.'); }
      break;
  }
});
document.addEventListener('submit', e => {
  const form = e.target; e.preventDefault();
  if (form.id === 'catalog-form') {
    for (const input of form.querySelectorAll('[data-qty]')) { input.setCustomValidity(''); if (!changeQuantity(input)) { input.reportValidity(); return; } }
    if (!selected().length) { error('Adicione pelo menos um produto para revisar o pedido.'); return; }
    save(); window.location.href = 'pedido.html';
  }
  if (form.id === 'physical-form' && active()) {
    const data = new FormData(form), values = {};
    for (const p of selected()) { const raw = data.get(p.id); const value = Number(raw); if (raw === '' || !integer(value)) { error('Informe a contagem inteira e não negativa de todos os itens.'); return; } values[p.id] = value; }
    state.physical = values; state.status = 'verified'; save();
    screen.innerHTML = intro('Verificação registrada', 'A contagem foi salva nesta sessão. O comprador já pode revisar o atendimento.') + `<section class="panel">${table()}<div class="actions">${link('Abrir resultado do comprador', 'acompanhamento.html')}${link('Voltar à operação', 'operacao.html', 'secondary')}</div></section>`;
    const h = screen.querySelector('h1'); h.tabIndex = -1; h.focus(); announce('Verificação registrada.');
  }
  if (form.id === 'accept-form') {
    if (state.status !== 'verified' || !document.getElementById('aceite').checked || !selected().some(p => attended(p) > 0)) return;
    state.status = 'confirmed'; save(); render(true); announce('Pedido demonstrativo confirmado.');
  }
  if (form.id === 'loss-form') {
    const data = new FormData(form), id = data.get('produto'), n = Number(data.get('quantidade')), reason = data.get('motivo');
    if (!PRODUCTS.some(p => p.id === id) || !integer(n) || n <= 0 || n > state.stock[id] || !['Produto deteriorado', 'Dano na separação', 'Outro descarte'].includes(reason)) { error('Informe uma perda positiva, inteira e até o saldo disponível, com motivo.'); return; }
    state.stock[id] -= n; state.losses.push({ id, n, reason });
    const invalidated = active(); if (invalidated) { state.status = 'pending'; state.physical = {}; }
    save();
    const product = PRODUCTS.find(p => p.id === id);
    form.hidden = true;
    const result = document.getElementById('loss-result'); result.hidden = false; result.className = 'notice success';
    const message = document.createElement('p'); message.textContent = `Perda registrada: ${product.name}, ${n} ${product.unit}. Saldo restante: ${state.stock[id]} ${product.unit}.${invalidated ? ' Pedido pendente: é necessário verificar novamente antes do aceite.' : ''} Nenhum estoque real foi alterado.`; result.append(message);
    const a = document.createElement('a'); a.href = 'operacao.html'; a.className = 'button'; a.textContent = 'Voltar à operação'; result.append(a); result.tabIndex = -1; result.focus();
  }
});
// Voltar/avançar pode restaurar uma página via BFCache; reler evita um status antigo.
window.addEventListener('pageshow', e => { if (e.persisted) { state = load(); render(); } });
render();
