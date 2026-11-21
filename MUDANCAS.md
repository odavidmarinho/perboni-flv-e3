# Mudanças da E2 para a E3

Referência: PDF de 19 páginas e arquivos `prototipo/index.html`, `style.css` e `app.js` do ZIP Entrega2_PerboniFLV (2). O protótipo foi executado e os wireframes foram inspecionados antes da implementação.

| E2 | E3 | Por que mudou |
|---|---|---|
| Uma página com 12 telas renderizadas em JavaScript | Cinco arquivos HTML com os mesmos estados de fluxo | Cumprir 3–5 páginas navegáveis sem perder decisões e saídas da E2 |
| Aparência cinza/preta de baixa fidelidade | Símbolo real da Perboni, verde de interface e fotografias ilustrativas | Aplicar a identidade real solicitada sem inventar outra marca; verde escuro garante legibilidade |
| Nome da empresa em texto | Símbolo original ao lado do nome em texto | A imagem obtida é o símbolo, não uma assinatura tipográfica completa; o nome não tenta falsificar o logotipo |
| Lista simples de três produtos | Três produtos preservados, busca, categoria, resumo e +/− | Facilitar montagem e demonstrar manipulação de DOM |
| Quantidades em linhas e tabelas | Grid no catálogo, Flexbox em linhas e ações, reorganização móvel | Funcionar em 360, 768 e 1280 px sem rolagem horizontal |
| Memória da página, apagada ao recarregar | `sessionStorage` entre páginas e recargas | Manter o mesmo pedido ao navegar por cinco documentos; o botão Reiniciar limpa tudo |
| Aceite como tela separada | Aceite explícito junto ao resultado, ainda obrigatório | Evitar uma sexta página e manter os valores visíveis no momento da decisão |
| Resultado de verificação em tela isolada | Estado de sucesso da página Operação com resumo e link para comprador | Preservar O3 e a transição clara de perfil |
| Perdas e sucesso em telas virtuais | Página Perdas com formulário e resultado no DOM | Validar e mostrar a baixa, o saldo e a invalidação sem recarregar |
| Navegação por botões de perfil | Links entre páginas e menu móvel com estado ARIA | Navegação real, teclado e URLs reconhecíveis |
| Eventos inline e estrutura HTML abreviada | Eventos com `addEventListener`, documentos completos e regiões semânticas | Separar responsabilidades e facilitar inspeção do código |
| Contagem e perdas com validação básica | Validação nativa e mensagens JS, limite técnico de 99999 | Bloquear vazios, negativos, frações e números excessivos; perdas continuam limitadas ao saldo |
| Sem framework | Aviso contextual Bootstrap 5.3.3 local e equivalente CSS comentado | Atender à exigência e funcionar offline |
| Feedback simples | Anúncios para tecnologia assistiva, foco e atalho para conteúdo | Tornar mudanças de estado e navegação compreensíveis pelo teclado |
| Documentação E2 | README, mudanças, testes, fontes e instruções de publicação | Permitir avaliação, reprodução e continuidade do grupo |

## Regras preservadas

- Mesmos produtos, unidades e saldos iniciais fictícios.
- Pedido vazio bloqueado; inteiros não negativos no catálogo e contagem.
- Envio inicia pendência, não confirma a compra.
- Atendimento = menor valor entre solicitado e físico.
- Divergências explícitas, nenhuma substituição automática.
- Nenhuma confirmação sem contagem e aceite; todos zerados bloqueiam aceite.
- Possibilidade de aceitar, cancelar ou solicitar nova contagem.
- Perda positiva até o saldo; perda invalida verificação pendente.
- Pedido encerrado não recebe nova contagem; reinício limpa a demonstração.
- Sem reserva, autenticação, preço, pagamento ou alteração do APP.

## Limites e pendências externas

As mudanças derivam de implementação e inspeção técnica, não de testes com pessoas. Não foram inventados participantes ou resultados de usabilidade. A E2 já registrava essa ausência.

O repositório público e os commits reais de todos os integrantes dependem de acesso e participação das pessoas. Nenhuma autoria dos colegas foi simulada. Os passos estão em `PUBLICAR.md`.
