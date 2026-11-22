# Perboni FLV — E3

Site acadêmico de gestão de pedidos e disponibilidade para uma distribuidora de frutas, legumes e verduras. Desenvolvido para compradores que planejam reposição e para a operação que confere e separa mercadoria. Continuidade da E0, E1 e especialmente do protótipo da E2.

**Princípio:** nenhum pedido é confirmado sem disponibilidade física verificada e aceite explícito do comprador. O catálogo sozinho não resolve a divergência entre saldo registrado e mercadoria utilizável identificada na E1.

## Executar

Requisito: Node.js instalado, sem necessidade de instalar dependências para usar o site.

1. Extraia o ZIP.
2. Abra um terminal dentro da pasta `PerboniFLV-E3`.
3. Execute `node servir.cjs` (ou `npm start`).
4. Acesse **http://127.0.0.1:8080** no navegador.
5. Encerre com `Ctrl+C`.

Alternativa com Python instalado: `python -m http.server 8080 --bind 127.0.0.1`, dentro da mesma pasta. Abra o mesmo endereço.

Use um servidor local ou GitHub Pages: a continuidade de dados entre páginas depende de uma origem HTTP comum. Abrir os arquivos isoladamente com `file://` pode dar comportamentos diferentes de armazenamento entre navegadores. Após iniciar o servidor, todas as imagens, CSS, JS e o framework são locais e o site funciona sem internet.

## Páginas

| Arquivo | O que faz | Continuidade da E2 |
|---|---|---|
| `index.html` | Catálogo, quantidades, busca, categoria e resumo | C1 |
| `pedido.html` | Revisão e envio para conferência | C2 |
| `acompanhamento.html` | Espera, divergências, aceite, confirmação e cancelamento | C3–C7 |
| `operacao.html` | Conferência física, resultado e histórico de perdas | O1–O3 |
| `perdas.html` | Formulário e confirmação de perda | O4–O5 |

As 12 telas da E2 foram agrupadas em estados de cinco páginas navegáveis reais. O menu principal e o rodapé conectam as páginas. Links de retorno e continuidade completam os fluxos.

## Roteiro de demonstração

1. No catálogo, informe **10 kg de tomate** e **5 kg de banana-prata**.
2. Clique em **Revisar pedido** e **Enviar para verificação**. O pedido fica pendente; nenhuma compra foi confirmada.
3. Vá para **Operação**. Conte **6 kg de tomate** e **5 kg de banana** e salve.
4. Abra o resultado do comprador. Confira a falta de **4 kg de tomate**.
5. A confirmação fica desabilitada sem aceite. Marque a caixa de aceite e confirme, ou cancele. O protocolo **DEMO-001** é apenas demonstrativo.
6. Reinicie, repita o envio e a contagem, mas antes de confirmar registre uma perda de **2 kg de tomate**, motivo **Produto deteriorado**.
7. Confira o saldo de **18 kg**, o histórico e o pedido novamente pendente: é obrigatória nova contagem.

Teste também: todos os itens físicos em zero (sem aceite), contagem acima do solicitado (atendimento limitado), perda maior que saldo (bloqueada) e perda igual ao saldo (permite zerar).

## Interações JavaScript reais

- Busca por nome sem distinguir acentos e filtro por categoria, com estado sem resultados.
- Quantidades por teclado ou botões +/−; resumo atualizado no DOM sem recarga.
- Envio e transição entre montagem, pendência, verificação e encerramento.
- Contagem física e cálculo `min(solicitado, físico)`, com divergências explícitas.
- Aceite obrigatório, cancelamento e solicitação de nova contagem.
- Perdas validadas, saldo local e histórico atualizados; invalidação da verificação pendente.
- Menu móvel com `aria-expanded`, reinício com confirmação e dados em `sessionStorage`.

## Validação e acessibilidade

HTML com `header`, `nav`, `main`, `section`, `aside` e `footer`; títulos hierárquicos; labels ligadas aos campos; `type="number"`, `required`, `min`, `max`, `step` e validação nativa. JavaScript acrescenta mensagens próprias em região de alerta. Os campos de quantidade seguem o recorte de inteiros da E2.

Tabelas com `caption`, cabeçalhos e `scope`; imagens com texto alternativo; atalho para conteúdo; foco visível; navegação com Tab/Shift+Tab; ações com Enter/Espaço; retorno de foco nos estados atualizados; anúncios de resumo e resultado; preferência por movimento reduzido respeitada. As mensagens de falta usam texto e valores além da cor.

CSS próprio em arquivo externo, sem atributo `style` no HTML/DOM. Grid organiza catálogo e painéis; Flexbox organiza navegação, quantidades e ações. Reorganização verificada em **360, 768 e 1280 px**.

## Bootstrap e equivalente puro

`perdas.html` usa o aviso **`.alert.alert-warning`** do Bootstrap **5.3.3**, carregado localmente por todas as páginas. O equivalente **`.aviso-puro`** está comentado em `assets/style.css`, junto à personalização do componente, explicando padding, margem, borda, raio e cores. A marcação também contém um comentário indicando esse local. O componente CSS não exige JavaScript do Bootstrap.

## Estrutura dos demais arquivos

| Arquivo/pasta | Finalidade |
|---|---|
| `assets/app.js` | Estado, validação, renderização dos estados e eventos das páginas |
| `assets/style.css` | Identidade visual, Grid/Flexbox, responsividade, foco e movimento reduzido |
| `assets/perboni-logo.png` | Símbolo real da marca, sem redesenho |
| `assets/tomate.jpg`, `banana.jpg`, `alface.jpg` | Fotografias ilustrativas; não comprovam variedade ou estoque da empresa |
| `assets/vendor/bootstrap.min.css` | Distribuição local oficial Bootstrap 5.3.3 |
| `assets/vendor/BOOTSTRAP-LICENSE.txt` | Licença MIT do Bootstrap |
| `servir.cjs` | Servidor HTTP local sem dependências, apenas em 127.0.0.1 |
| `package.json` | Comandos de execução e dependência para testes |
| `tests/browser.cjs` | Testes de integração reproduzíveis com Playwright e Edge |
| `evidencias/` | Resultados e capturas da validação entregue |
| `MUDANCAS.md` | Diferenças em relação à E2 e motivos |
| `TESTES.md` | Cobertura, resultados e limites dos testes |
| `GUIA-GRUPO.txt` | Divisão sugerida e passos para as contribuições reais do grupo |
| `PUBLICAR.md` | Passos exatos de publicação e participação do grupo |
| `FONTES.md` | Origem da marca, fotos e dependências |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` | Contexto do produto e registro do sistema visual implementado |
| `.gitignore` | Exclui dependências e resultados temporários de novas execuções |

## Repetir os testes

Com o servidor ativo em um terminal, em outro terminal da pasta execute:

```sh
npm install
npm test
```

O teste usa Microsoft Edge instalado. Se preferir Chrome instalado, no PowerShell execute `$env:BROWSER_CHANNEL='chrome'; npm test`. A biblioteca Playwright é a única dependência de desenvolvimento; não participa do site publicado. Novos resultados são gravados em `test-results/` (ignorado pelo Git). As evidências da execução entregue ficam em `evidencias/`.

## Dados e limites

Os saldos 20 kg de tomate, 30 kg de banana-prata e 15 unidades de alface são fictícios e foram preservados da E2. `sessionStorage` mantém o estado na mesma aba/origem entre navegações e recargas. Reiniciar apaga o pedido e as perdas; encerrar a sessão normalmente descarta os dados. Uma nova aba tem sessão independente, embora alguns navegadores copiem o estado inicial ao duplicar uma aba. O aceite não é persistido até confirmar: recarregar exige marcá-lo novamente.

Não há integração com o APP, estoque real, autenticação, envio de dados, reserva, preços, pagamento, entrega ou substituição automática. O registro de perda altera apenas o saldo demonstrativo. O atendimento não baixa esse saldo, preservando a distinção entre conferência e integração de estoque. Uma perda posterior ao encerramento não reabre um pedido confirmado/cancelado.

## Créditos do grupo

Identificação transcrita das entregas anteriores:

| Integrante | RA |
|---|---|
| David Richard Marinho | 22610620 |
| Luiz Vinícius Moraes Dos Santos | 22609501 |
| Lukas Ferreira de Souza | 22609192 |
| Eduardo Simari de Lourenço Rocha | 22610027 |

Implementação E3 preparada com assistência de IA a pedido do solicitante, com base nas entregas fornecidas. Os créditos não afirmam participação individual em alterações que ainda não foram feitas pelos integrantes. O histórico da branch `main` contém contribuições das quatro contas: `odavidmarinho`, `EduardoSimari`, `lukasferreira00` e `luizvncsmds`. As revisões dos colegas estão em `revisoes/`, incorporadas pelos PRs nº 1, 2/3 e 4, com autoria preservada. As complementações assistidas por IA estão identificadas. Veja `PUBLICAR.md`.

## Situação da publicação

Repositório público: https://github.com/odavidmarinho/perboni-flv-e3 . Publicação preparada pela conta autenticada no navegador. Os commits públicos de envio dos arquivos pertencem ao solicitante; o bundle entregue preserva separadamente o histórico local de implementação. As contribuições dos três colegas foram incorporadas em 21 e 22/11/2026. O ZIP final é gerado da mesma versão da branch `main`. O guia do grupo permanece como registro do procedimento utilizado.


## Entrega final — 22/11/2026

Repositório público: https://github.com/odavidmarinho/perboni-flv-e3

Site: https://odavidmarinho.github.io/perboni-flv-e3/

Entregar o link do repositório e o ZIP da mesma versão. README, MUDANCAS, código, evidências e revisões dos integrantes já estão incluídos no pacote. Não é necessário enviar o bundle Git ao professor.
