# Validação técnica — E3

Execução em **21/11/2026**, Microsoft Edge **158.0.4370.33**, via Playwright **1.62.1**, usando o servidor HTTP local. Resultado: **93 verificações aprovadas**, nenhum erro JavaScript ou recurso HTTP ausente. Relatório detalhado em `evidencias/resultados.json`. Os testes acionam os campos e botões reais do navegador.

## Fluxos e regras

| Cobertura | Resultado |
|---|---|
| Pedido vazio, quantidade negativa, fracionária e vazia | Bloqueados |
| Busca por produto, categoria e estado sem resultados | Funcionam; filtro preserva quantidades |
| Incremento/decremento e resumo no DOM | Atualizados sem recarregar |
| Envio para conferência | Pendente; ainda sem aceite ou confirmação |
| Contagem vazia/negativa | Bloqueada pela validação nativa |
| 10 kg tomate solicitados, 6 kg contados | 6 kg atendidos e falta explícita de 4 kg |
| Confirmação sem aceite e retirada de aceite | Bloqueadas |
| Aceite válido | Confirma e apresenta DEMO-001 |
| Navegação após confirmação | Mantém o estado confirmado |
| Pedido encerrado | Nova contagem indisponível |
| Todos os itens físicos zerados | Confirmação indisponível, permite cancelar ou recontar |
| Cancelamento | Encerra sem compra |
| Contagem superior ao solicitado | Atendimento limitado ao solicitado |
| Solicitar nova contagem | Limpa o resultado anterior |
| Recarregar resultado | Preserva contagem, exige novo aceite |
| Perda acima do saldo, zero ou fracionária | Bloqueada |
| Seleção de alface no formulário de perda | Unidade muda para un |
| Perda válida de tomate | Saldo reduzido e feedback com quantidade e saldo restante |
| Perda com pedido verificado pendente | Invalida contagem e aceite |
| Histórico de perdas | Apresenta produto, quantidade e motivo |
| Perda igual ao saldo | Permite zerar |
| Reiniciar demonstração | Limpa pedido e perdas |

## Responsividade e estrutura

As **cinco páginas** foram abertas em **360, 768 e 1280 pixels**, sem rolagem horizontal (`scrollWidth <= innerWidth`). Em cada combinação foi verificada a presença de um `h1`, regiões semânticas, imagens carregadas e com `alt`, e ausência de atributo `style`.

Também foram testados pedido preenchido, resultado com divergência e conferência operacional nas três larguras. As capturas completas da execução foram produzidas em `test-results/`; uma seleção representativa e o relatório integral estão entregues em `evidencias/`.

## Teclado e revisão visual

O menu móvel foi aberto com estado ARIA sincronizado. O teste percorreu por teclado o atalho de conteúdo e confirmou a transferência de foco para `main`. Os controles usam elementos nativos, ordem do documento e foco visível. A inspeção estática conferiu labels, `scope`, alertas, regiões de status e preferência por movimento reduzido.

Revisão visual independente sobre capturas de desktop, celular e tablet e inspeção do código: **ship**, sem correções materiais nas evidências analisadas. A revisão confirmou continuidade visual da marca e distinção entre saldo, contagem e aceite. Isso não representa auditoria formal WCAG nem substitui testes manuais com leitores de tela.

## Limites da validação

- Testes automatizados e revisão visual técnica, sem participantes reais ou alegações de resultados de usabilidade.
- Navegador testado: Edge no Windows. Não há afirmação de cobertura de todos os dispositivos ou navegadores.
- Backend, autenticação, envio, pagamento, integração ao APP e estoque real não fazem parte deste protótipo e não foram testados.
- A validação de 93 verificações foi executada localmente. Publicação do repositório não equivale a teste de hospedagem; GitHub Pages é opcional.
- A exigência de commits de todos os integrantes precisa ser cumprida com contribuições e autoria reais; não foi simulada.

## Como reproduzir

Veja `README.md`: inicie o servidor, instale a dependência de testes e execute `npm test`. Cada execução gera seu próprio relatório e capturas; não substitui automaticamente as evidências entregues.

