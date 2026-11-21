// Teste de integração: usa os controles reais das cinco páginas.
// Inicie `npm start` antes de `npm test`. Edge é o navegador padrão.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.BASE_URL || 'http://127.0.0.1:8080';
const output = path.resolve(__dirname, '../test-results');
fs.mkdirSync(output, { recursive: true });
const results = [], errors = [];
function check(name, value) { assert.ok(value, name); results.push({ name, result: 'aprovado' }); }
(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await context.newPage();
  p.on('pageerror', e => errors.push(e.message));
  p.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  p.on('dialog', dialog => dialog.accept());
  const go = async file => { await p.goto(`${base}/${file}`); await p.waitForSelector('h1'); };
  const reset = async () => { await go('index.html'); await p.evaluate(() => sessionStorage.clear()); await p.reload(); };
  const quantity = async (id, value) => p.locator(`#q-${id}`).fill(value);
  async function send() { await p.getByRole('button', { name: 'Revisar pedido' }).click(); await p.waitForURL('**/pedido.html'); await p.getByRole('button', { name: 'Enviar para verificação' }).click(); await p.waitForURL('**/acompanhamento.html'); }
  async function count(tomato, banana) { await go('operacao.html'); await p.locator('#physical-tomate').fill(tomato); if (banana !== undefined) await p.locator('#physical-banana').fill(banana); await p.getByRole('button', { name: 'Salvar verificação' }).click(); await p.getByRole('heading', { name: 'Verificação registrada' }).waitFor(); await go('acompanhamento.html'); }
  try {
    await reset();
    await p.getByRole('button', { name: 'Revisar pedido' }).click(); check('Pedido vazio bloqueado', await p.locator('#error').innerText() !== '');
    for (const value of ['-1', '1.5', '']) { await quantity('tomate', value); check(`Quantidade inválida bloqueada: ${value || 'vazia'}`, await p.locator('#q-tomate').evaluate(el => !el.checkValidity())); }
    await quantity('tomate', '-1'); await p.locator('#busca').fill('alface');
    await p.getByRole('button', { name: 'Revisar pedido' }).click();
    check('Filtro revela campo inválido para correção', await p.locator('#q-tomate').isVisible() && await p.locator('#busca').inputValue() === '');
    await quantity('tomate', '10'); await quantity('banana', '5');
    await p.locator('#busca').fill('alface'); check('Busca filtra produtos', await p.locator('.product:visible').count() === 1);
    await p.locator('#busca').fill('xyz'); check('Busca sem resultados apresenta recuperação', await p.locator('#no-results').isVisible());
    await p.locator('#busca').fill(''); await p.locator('#categoria').selectOption('Frutas'); check('Categoria filtra sem apagar quantidades', await p.locator('.product:visible').count() === 1 && await p.locator('#q-tomate').inputValue() === '10');
    await p.locator('#categoria').selectOption(''); await send();
    check('Envio permanece pendente sem confirmar compra', await p.getByRole('heading', { name: 'Aguardando contagem física' }).isVisible());
    check('Sem contagem não há aceite', await p.locator('#aceite').count() === 0);
    await go('operacao.html'); await p.getByRole('button', { name: 'Salvar verificação' }).click(); check('Contagem vazia bloqueada nativamente', await p.locator('#physical-tomate').evaluate(el => !el.checkValidity()));
    await p.locator('#physical-tomate').fill('-1'); check('Contagem negativa bloqueada', await p.locator('#physical-tomate').evaluate(el => !el.checkValidity()));
    await count('6', '5'); check('Divergência explícita: faltam 4 kg', (await p.locator('#screen').innerText()).includes('4 kg'));
    check('Sem aceite a confirmação fica desabilitada', await p.locator('#confirm').isDisabled());
    await p.locator('#aceite').check(); check('Aceite habilita confirmação', await p.locator('#confirm').isEnabled());
    await p.locator('#aceite').uncheck(); check('Retirar aceite bloqueia confirmação', await p.locator('#confirm').isDisabled());
    await p.locator('#aceite').check(); await p.locator('#confirm').click(); check('Confirmação apresenta protocolo', (await p.locator('#screen').innerText()).includes('DEMO-001'));
    await go('index.html'); await go('acompanhamento.html'); check('Confirmação persiste entre páginas', await p.getByRole('heading', { name: 'Pedido confirmado' }).isVisible());
    await go('operacao.html'); check('Pedido encerrado bloqueia nova contagem', await p.locator('#physical-form').count() === 0);
    await reset(); await quantity('tomate', '10'); await send(); await count('0'); check('Todos zerados bloqueiam aceite', await p.locator('#aceite').count() === 0 && (await p.locator('#screen').innerText()).includes('Nenhum item'));
    await p.getByRole('button', { name: 'Cancelar pedido' }).click(); check('Cancelamento encerra sem compra', await p.getByRole('heading', { name: 'Pedido cancelado' }).isVisible());
    await reset(); await quantity('tomate', '10'); await send(); await count('50'); check('Atendimento limitado à quantidade solicitada', await p.locator('tbody tr td').last().innerText() === '10 kg');
    await p.getByRole('button', { name: 'Solicitar nova contagem' }).click(); await p.waitForURL('**/operacao.html'); check('Nova contagem limpa resultado anterior', await p.locator('#physical-tomate').inputValue() === '');
    await count('10'); await p.reload(); check('Recarregar preserva resultado mas exige novo aceite', await p.locator('#confirm').isDisabled());
    await go('perdas.html'); await p.locator('#quantidade').fill('21'); await p.locator('#motivo').selectOption('Produto deteriorado'); await p.getByRole('button', { name: 'Salvar perda' }).click(); check('Perda superior ao saldo bloqueada', await p.locator('#quantidade').evaluate(el => !el.checkValidity()));
    await p.locator('#quantidade').fill('0'); check('Perda zero bloqueada', await p.locator('#quantidade').evaluate(el => !el.checkValidity()));
    await p.locator('#quantidade').fill('1.5'); check('Perda fracionária bloqueada', await p.locator('#quantidade').evaluate(el => !el.checkValidity()));
    await p.locator('#produto').selectOption('alface'); check('Unidade acompanha produto da perda', await p.locator('#loss-unit').innerText() === 'un');
    await p.locator('#produto').selectOption('tomate'); await p.locator('#quantidade').fill('2'); await p.getByRole('button', { name: 'Salvar perda' }).click();
    check('Perda registrada com saldo restante', (await p.locator('#loss-result').innerText()).includes('18 kg'));
    await go('acompanhamento.html'); check('Perda invalida verificação e aceite pendentes', await p.getByRole('heading', { name: 'Aguardando contagem física' }).isVisible() && await p.locator('#aceite').count() === 0);
    await go('operacao.html'); check('Histórico apresenta motivo da perda', (await p.locator('#loss-history').innerText()).includes('Produto deteriorado'));
    await go('perdas.html'); await p.locator('#quantidade').fill('18'); await p.locator('#motivo').selectOption('Outro descarte'); await p.getByRole('button', { name: 'Salvar perda' }).click(); check('Perda igual ao saldo permite zerar', (await p.locator('#loss-result').innerText()).includes('0 kg'));
    await reset(); check('Reinício limpa pedido e perdas', await p.locator('#q-tomate').inputValue() === '0');
    await p.getByRole('button', { name: 'Aumentar quantidade de Tomate' }).click(); check('Botão de incremento atualiza DOM e resumo', (await p.locator('#summary-items').innerText()).includes('1 kg'));
    await p.getByRole('button', { name: 'Diminuir quantidade de Tomate' }).click(); check('Decremento restaura resumo vazio', (await p.locator('#summary-items').innerText()).includes('vazia'));
    // Captura todos os arquivos nos três tamanhos pedidos, com verificações semânticas.
    for (const width of [360, 768, 1280]) {
      await p.setViewportSize({ width, height: 900 });
      for (const file of ['index.html', 'pedido.html', 'acompanhamento.html', 'operacao.html', 'perdas.html']) {
        await go(file);
        check(`Sem overflow: ${file} / ${width}px`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        check(`Semântica e imagens: ${file} / ${width}px`, await p.evaluate(() => document.querySelectorAll('h1').length === 1 && ['header','nav','main','section','footer'].every(s => document.querySelector(s)) && [...document.images].every(i => i.hasAttribute('alt') && i.complete && i.naturalWidth > 0)));
        check(`Sem CSS inline: ${file} / ${width}px`, await p.locator('[style]').count() === 0);
        await p.screenshot({ path: `${output}/${file.replace('.html','')}-${width}.png`, fullPage: true });
      }
    }
    await go('index.html'); await p.setViewportSize({ width: 360, height: 900 }); await p.getByRole('button', { name: 'Menu', exact: true }).click(); check('Menu móvel abre com ARIA sincronizado', await p.locator('.menu-toggle').getAttribute('aria-expanded') === 'true' && await p.locator('#navegacao').isVisible());
    await p.keyboard.press('Escape');
    await p.reload(); await p.keyboard.press('Tab'); check('Atalho para conteúdo acessível por teclado', await p.locator('.skip-link').evaluate(el => el === document.activeElement));
    await p.keyboard.press('Enter'); check('Atalho move foco ao conteúdo', await p.locator('main').evaluate(el => el === document.activeElement));
    // Capturas adicionais do fluxo preenchido para revisão visual.
    await p.setViewportSize({width:1280,height:900}); await reset(); await quantity('tomate','10'); await quantity('banana','5'); await send(); await count('6','5');
    for (const width of [360,768,1280]) {
      await p.setViewportSize({width,height:900});
      for (const file of ['pedido.html','acompanhamento.html','operacao.html']) { await go(file); check(`Pedido preenchido sem overflow: ${file} / ${width}px`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await p.screenshot({path:`${output}/fluxo-${file.replace('.html','')}-${width}.png`,fullPage:true}); }
    }
    check('Nenhum erro JS ou recurso HTTP ausente', errors.length === 0);
    fs.writeFileSync(`${output}/resultados.json`, JSON.stringify({ browser: await browser.version(), date: new Date().toISOString(), checks: results.length, results, errors }, null, 2));
    console.log(`${results.length} verificações aprovadas; capturas em test-results/.`);
  } finally { await browser.close(); }
})().catch(err => { console.error(err); process.exitCode = 1; });
