# Complementação técnica à revisão funcional do Eduardo

## Autoria e finalidade

Complementação preparada por assistência de IA a pedido de David Richard Marinho, em 21/11/2026. A revisão original de Eduardo Simari de Lourenço Rocha permanece em [eduardo.md](eduardo.md), com seu commit e autoria preservados. Os testes descritos abaixo foram executados nesta complementação e não são atribuídos ao Eduardo.

Objetivo: esclarecer a interpretação dos resultados originais e cobrir os cenários que não estavam detalhados naquele relato. Não houve novos participantes ou entrevistas.

## Evidência de execução

- Ambiente: versão publicada em https://odavidmarinho.github.io/perboni-flv-e3/ .
- Microsoft Edge 158.0.4370.33, Windows, Playwright 1.62.1.
- Execução registrada em 21/11/2026, às 18:57 no horário de Brasília.
- Suíte reproduzível: `tests/browser.cjs`.
- Resultado: **93 verificações aprovadas**, sem erros JavaScript ou recursos HTTP ausentes na execução.
- Relatório desta execução: [complemento-eduardo.json](../evidencias/complemento-eduardo.json).

## Esclarecimentos sobre o relato original

### Divergência e aceite

O sistema permite concluir um pedido com quantidade reduzida porque essa é uma decisão prevista no recorte da E2. O comprador deve conhecer o atendimento e aceitar explicitamente a redução. A divergência, sozinha, não exige bloquear definitivamente o pedido.

O relato do Eduardo informa confirmação após um alerta, mas não detalha se a caixa de aceite foi marcada. Portanto, aquele relato não comprova confirmação sem aceite. Na execução complementar, o botão ficou desabilitado sem a caixa marcada, foi habilitado ao marcar e voltou a ficar desabilitado ao retirar o aceite.

### Cancelamento

O cancelamento está disponível no resultado da conferência, **antes de confirmar**. Após confirmar, o pedido está encerrado; não disponibilizar cancelamento nesse estado corresponde à regra da E2. Cancelamento posterior à confirmação seria uma ampliação de escopo, não uma falha comprovada do fluxo implementado.

A execução complementar confirmou o cancelamento antes da confirmação, com estado final de pedido cancelado e sem compra real.

### Motivo da perda

O rótulo disponível na interface é **Produto deteriorado**. A expressão “Produto estragado”, usada na revisão original, é uma descrição informal; não é o texto exato da opção do formulário. A perda de 2 kg de tomate reduz o saldo demonstrativo de 20 para 18 kg, como relatado.

## Cenários complementares executados

| Cenário | Resultado observado |
|---|---|
| Solicitar 10 kg de tomate e 5 kg de banana; conferir 6 kg e 5 kg | Atendimento de 6 kg e 5 kg, com falta explícita de 4 kg de tomate |
| Tentar confirmar sem aceite; marcar e depois desmarcar | Botão desabilitado, habilitado e novamente desabilitado, respectivamente |
| Confirmar com aceite válido | Estado confirmado e protocolo demonstrativo DEMO-001 |
| Informar disponibilidade física zero para todos os itens | Aceite indisponível; cancelamento e nova contagem continuam como alternativas |
| Cancelar no resultado, antes da confirmação | Pedido encerrado como cancelado |
| Informar contagem maior que a quantidade solicitada | Atendimento limitado à quantidade solicitada |
| Solicitar nova contagem | Resultado anterior apagado e pedido devolvido à operação |
| Perda acima do saldo, zero ou fracionária | Valores bloqueados pela validação |
| Perda válida de 2 kg de tomate após conferência, antes do aceite final | Saldo de 18 kg; contagem invalidada e pedido novamente pendente |
| Consultar resultado depois dessa perda | Sem aceite disponível até registrar nova contagem |
| Registrar perda igual ao saldo restante | Saldo pode chegar a zero sem ficar negativo |
| Consultar histórico | Produto, quantidade e motivo registrados |

## Conclusão e limites

Os cenários executados confirmam as regras de conferência e aceite do protótipo. As interpretações de divergência e cancelamento do relato original foram esclarecidas sem alterar o escopo do site. Não foi necessário mudar o código da aplicação para corrigir esses dois comportamentos, pois correspondem às regras existentes.

A contribuição do Eduardo é sua revisão original, incorporada pelo Pull Request nº 1. Esta complementação e sua evidência são uma contribuição técnica posterior, solicitada por David. O registro não equivale a auditoria formal de acessibilidade nem a teste de usabilidade com participantes. A participação dos outros integrantes deve continuar sendo registrada por suas próprias contas.
