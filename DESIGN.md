---
name: Perboni FLV E3
description: Interface operacional de reposição e conferência física.
colors:
  ink: "#22372c"
  muted: "#526157"
  green: "#285c36"
  green-dark: "#194227"
  soft: "#edf3e8"
  paper: "#f7f8f4"
  line: "#d9e0d5"
  red: "#a82e21"
  white: "#fff"
  focus: "#b44413"
  field-border: "#9cae9c"
  warning-bg: "#fff2df"
  warning-text: "#754017"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 4.1vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.02em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: ".875rem"
    fontWeight: 700
    lineHeight: 1.6
rounded:
  surface: "14px"
  control: "8px"
  status: "6px"
  quantity: "7px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  group: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.green}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  button-danger:
    textColor: "{colors.red}"
    rounded: "{rounded.control}"
    padding: "11px 20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  panel:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.surface}"
    padding: "28px"
  badge-state:
    textColor: "{colors.green}"
    rounded: "{rounded.status}"
    padding: "6px 10px"
---

# Design System: Perboni FLV E3

## Overview

**Creative North Star: "Reposição com clareza"**

Um aplicativo operacional de reposição: superfícies claras, verde de ação e informação organizada para leitura e conferência. O símbolo verdadeiro da Perboni permanece como referência de identidade; as cores da interface são derivadas da marca, sem constituir um manual oficial.

Arial é continuidade explícita do protótipo E2. A densidade moderada, as fotografias ilustrativas dos produtos e os campos grandes favorecem o trabalho de selecionar, contar e comparar quantidades.

**Key Characteristics:**
- Verde funcional sobre superfícies claras.
- Tipografia Arial herdada e números tabulares nas comparações.
- Bordas discretas e profundidade tonal, sem sombras.
- Conteúdo reorganizado para uso em celular.

## Colors

Uma paleta vegetal e discreta, com calor reservado a alertas.

### Primary
- **Verde operacional** (`green`): ações principais, links, disponibilidade e etapas atuais.
- **Verde profundo** (`green-dark`): passagem do mouse nas ações e faixa demonstrativa.

### Secondary
- **Vermelho de divergência** (`red`): erros, reduções e ações destrutivas, sempre acompanhados de texto.
- **Aviso quente** (`warning-bg`, `warning-text`): contexto que exige atenção antes de continuar.

### Neutral
- **Tinta vegetal** (`ink`) e **texto auxiliar** (`muted`): hierarquia de leitura.
- **Papel claro** (`paper`), **branco** (`white`) e **verde suave** (`soft`): fundo, cartões e resumo.
- **Divisória** (`line`) e **contorno de campo** (`field-border`): separação estrutural e reconhecimento de entradas.
- **Foco quente** (`focus`): identificação de navegação pelo teclado.

**The Verde de ação Rule.** O verde concentra ações, navegação corrente e indicação de disponibilidade; divergências usam vermelho e avisos usam tons quentes.

## Typography

**Display Font:** Arial, Helvetica, sans-serif.
**Body Font:** Arial, Helvetica, sans-serif.

A mesma família atende toda a interface. Peso e tamanho distinguem papéis; as tabelas e entradas numéricas usam números tabulares.

### Hierarchy
- **Display:** título principal fluido; largura máxima observada de 19ch. Títulos compactos usam `clamp(2rem, 3.3vw, 2.75rem)`.
- **Headline:** títulos de seções e produtos.
- **Title:** subseções; o resumo usa variação de 1.25rem.
- **Body:** leitura operacional com parágrafos até 72ch e orientação inicial até 62ch.
- **Label:** rótulos de formulário; conteúdo auxiliar usa .875rem, .8rem e .75rem conforme a densidade.

**The Continuidade Rule.** A família Arial acompanha títulos, corpo e controles para manter a continuidade do protótipo E2.

## Layout

Container central de largura máxima (1200px), com margens internas laterais (32px) no desktop. Cabeçalho e rodapé seguem a mesma largura. Espaçamento principal de página (48px 32px 72px), com início (52px) a partir de 1280px.

Catálogo em área flexível e resumo lateral (290px), separados por (32px). Produtos em três colunas com intervalo (18px). Até 1050px: duas colunas e resumo (250px), com intervalo (24px). Até 800px: navegação recolhida em menu, resumo estático abaixo do conteúdo e grade de três produtos. Até 580px: produto em linha com foto lateral (112px), controles empilhados e laterais da página (16px). A reorganização intermediária de três colunas é comportamento existente, não uma escala monotônica de colunas.

Tabelas mantêm comparação direta, usando largura fixa e quebra de conteúdo no celular. Grupos de ações permitem quebra de linha; alvos principais têm altura mínima (46px), controles de quantidade (44px).

## Elevation & Depth

Não há sombras na interface. Cartões brancos, resumo verde suave, bordas finas e separadores produzem profundidade tonal. O resumo é aderente no desktop com distância superior (24px); torna-se estático no celular.

**The Plano por padrão Rule.** A separação entre superfícies usa fundo e borda; não acrescentar sombras decorativas às superfícies operacionais.

## Shapes

Superfícies usam o raio `surface`; botões e campos usam `control`. Estados têm cantos discretos `status`; o seletor de quantidade agrupa três controles dentro de um único contorno `quantity`. Os números de etapas são circulares. Fotografias são recortadas com `object-fit: cover` dentro do cartão.

## Components

### Buttons
Ações diretas, com texto explícito e peso forte. A principal usa verde e branco; a secundária mantém superfície branca e borda; a destrutiva usa vermelho sobre transparência. O hover escurece a principal ou colore suavemente a superfície. Foco global com contorno (3px), afastado (4px); desabilitados com opacidade (.48).

### Chips
O estado do pedido usa fundo (#e8efe3), borda (#c3d4b9), texto verde e peso forte. É indicador informativo, sem hover interativo.

### Cards / Containers
Cartões de produto têm borda fina, foto recortada e corpo com respiro (20px 16px). Painéis usam padding normativo do token e o reduzem em telas menores. O resumo usa superfície suave e padding (26px).

### Inputs / Fields
Campos brancos com contorno visível e altura mínima (46px). Rótulos fortes acima dos campos, dicas abaixo. Quantidade agrupa botões laterais e entrada central alinhada, com foco do grupo (2px) verde afastado (3px). Mensagens de erro usam texto vermelho forte; erros são anunciados pelo protótipo.

### Navigation
Links discretos de tamanho (.9rem); página corrente com peso forte e linha verde inferior (2px). O menu móvel aparece até 800px e revela os links com quebra de linha. Etapas numeradas usam linha inferior e círculo preenchido para indicar a posição atual.

### Motion
Entrada de tela em (.28s), curva `cubic-bezier(.16,1,.3,1)`, deslocamento vertical inicial (5px). A preferência por movimento reduzido remove animações. Não há transições adicionais de hover no CSS entregue.

## Do's and Don'ts

### Do:
- **Do** preservar o símbolo original e a identificação Perboni FLV.
- **Do** associar estados e divergências a texto explícito, além da cor.
- **Do** conservar o foco visível e a redução de movimento.

### Don't:
- **Don't** apresentar esta interface como manual oficial de marca.
- **Don't** substituir a Arial herdada por uma nova fonte de identidade.
- **Don't** usar fotografias ilustrativas como evidência de estoque real.
