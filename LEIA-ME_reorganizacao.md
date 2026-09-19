# Wave Studio — Reorganização da estrutura do projeto

## O que mudou

### 1. Nova pasta `assets/`
Todos os recursos estáticos passaram a viver dentro de `assets/`, organizados por tipo:
```
assets/
├── css/      → style.css, overrides.css + CSS extraído do inline (ver ponto 3)
├── js/       → site.js
├── fonts/    → Cinzel, Cormorant Garamond, Bootstrap Icons
├── icons/    → favicons e ícones PWA
└── images/
    ├── logos/        → logótipo, og-image
    ├── hero/          → imagens de destaque (hero, cabeçalhos de página)
    ├── backgrounds/   → fundos decorativos
    ├── team/          → fotos da equipa
    ├── services/       → fotos de cada serviço
    ├── gallery/        → fotos da galeria
    └── _arquivo/       → imagens não usadas em nenhuma página (mantidas por segurança)
```

### 2. Imagens: nomes descritivos + WebP
- Todas as imagens em uso foram renomeadas com nomes descritivos em vez de
  `galeria3.jpeg`, `cp.jpg`, `treinojpg.jpg`, etc. — por exemplo:
  `pilates.webp`, `cecilia-pinto.webp`, `pt-individual.webp`.
- Convertidas para **WebP**, com correção de espaço de cor: `cp.jpg` e
  `galeria1.jpeg` estavam em **CMYK** (o mesmo problema já identificado no
  logótipo numa auditoria anterior) — foram corrigidas para sRGB no processo.
- Peso total das imagens: **12,1 MB → 3,7 MB** (redução de ~70%).
- 7 ficheiros de imagem que não estavam referenciados em nenhuma página
  (`cross_training.jpg`, `logomarca.jpg`, `nossoespaco1.jpg`, etc.) foram
  movidos para `assets/images/_arquivo/` em vez de apagados.

### 3. CSS inline removido (regra do projeto)
Foram encontrados blocos `<style>` embutidos em 5 páginas (~840 linhas no
total) — o mesmo tipo de problema já corrigido anteriormente noutras páginas.
Foram extraídos para ficheiros externos dedicados:
- `home.css` (index.html)
- `contactos.css`
- `galeria.css`
- `horarios.css`
- `servicos.css`

### 4. Favicon completo + manifest
- Antes: um único `<link rel="icon">` a apontar para o logótipo em PNG.
- Agora: `favicon.ico`, `favicon-16.png`, `favicon-32.png`,
  `apple-touch-icon.png`, `android-chrome-192/512.png` + `site.webmanifest`,
  gerados a partir do logótipo.

### 5. `og:image` corrigido
Apontava para `imagens/og-image.jpg`, um ficheiro que não existia no projeto.
Foi gerado um `og-image.jpg` (1200×630, formato recomendado para
WhatsApp/LinkedIn/Facebook) a partir da imagem de destaque, e a meta tag foi
corrigida em todas as páginas.

### 6. Bug do hero com fundo duplo
O hero da página inicial carregava **duas imagens de fundo em simultâneo**
(uma local + uma do Unsplash como suposto "fallback", mas sem `onerror`, por
isso as duas eram pedidas sempre). Corrigido para usar apenas a imagem local.

### 7. Novos ficheiros técnicos na raiz
- `robots.txt`
- `sitemap.xml` (as 11 páginas do site)
- `.well-known/security.txt`
- `site.webmanifest`

## O que **não** foi alterado (decisão deliberada)

Seguindo a recomendação de evolução incremental (em vez de reestruturação
completa):
- **`style.css` e `overrides.css` não foram fragmentados** em vários
  ficheiros temáticos (`buttons.css`, `forms.css`, etc.) — o projeto ainda é
  pequeno e essa divisão traria mais complexidade de manutenção do que
  benefício neste momento.
- **`site.js` não foi dividido em módulos** — já está organizado internamente
  por secções comentadas.
- **Não foram criadas pastas vazias** para funcionalidades futuras
  (blog, reservas online, newsletter, etc.) — evita código morto. Quando
  alguma dessas áreas avançar para desenvolvimento real, cria-se a pasta
  nessa altura, dentro da estrutura `assets/` já preparada para crescer.
- `humans.txt` e `browserconfig.xml` foram propositadamente omitidos por não
  trazerem valor prático para este projeto.

## Como testar

Todos os caminhos são relativos, por isso basta abrir `index.html` num
servidor local (ex.: `python3 -m http.server`) a partir da raiz do projeto,
ou fazer upload da pasta completa para o alojamento estático.

---

# Actualização — 19 de Setembro de 2026

## 1. Mapa de aulas de grupo → Setembro (`pages/horarios.html`)
Fonte: PDF "Horários Wave Studio. 18SETEMBRO2026" (Canva, 18-09-2026).

| Dia | Antes | Agora |
|---|---|---|
| 4.ª feira | apenas Circuito 19:00 | + **Pilates Mat 20:00** |
| 5.ª feira | Pilates Mat **18:00** | **18:30** |
| 5.ª feira | Yoga 20:00 | **removida** (não consta do horário de Setembro) |
| 6.ª feira | coluna vazia (bloco comentado) | estado explícito "Sem aulas de grupo" |

Segunda, terça e sábado já correspondiam ao PDF. Acrescentada a etiqueta
"Horário em vigor desde 18 de setembro de 2026".

## 2. Célia Laranjeira acrescentada à equipa (`pages/equipa.html`)
Biografia construída exclusivamente a partir dos dois certificados fornecidos:
- Pilates — Nível I (30 h, 2018, 18 valores), entidade formadora certificada
  DGERT, com reconhecimento IPDJ.
- Workshop de Exercícios Corretivos (3 h, Julho 2018, formadora Patrícia Alves).

**Não publicado** (dados pessoais / identificadores): número de contribuinte e
números de certificado que constam dos documentos originais.

**PENDENTE:** fotografia real. Está em uso um avatar provisório com as iniciais
(`assets/images/team/celia-laranjeira.webp`, 900×900). Substituir pelo retrato
definitivo — quadrado, ~900 px, e remover a classe `is-placeholder` do `<img>`.

**PENDENTE:** confirmar quem lecciona cada aula de Pilates. Todas continuam
atribuídas à Sofia, como estava antes.

## 3. Cartões de equipa — revisão visual
- **Bug corrigido:** duas `<div>` por fechar antes de `</section>` no segundo
  bloco de cartões (marcação inválida).
- Cartão passou a coluna flexível → o CTA fica encostado à base em todos os
  cartões (antes flutuava a alturas diferentes conforme o tamanho da biografia).
- Retrato: 128 px com anel duplo (branco + sálvia) e sombra, em vez de borda plana.
- Áreas de intervenção passaram de uma linha corrida em maiúsculas para
  etiquetas individuais.
- Dois grupos com cabeçalho próprio: "Fitness & Treino" e "Bem-estar & Estética"
  (o segundo não tinha título).
- Grelha de 4 → 3 colunas: mais largura para a biografia em serifa.
- Cecília e Salutem usam logótipo, não retrato → `object-fit: contain` sobre
  branco, deixam de ser cortados pelo topo.
- CSS consolidado em `style.css` § 18. Removidas as regras `.team-card__*`
  duplicadas de `overrides.css` (fonte única).

## 4. Massagens → Setembro 2026
Substituídos os blocos de Junho e Julho (já passados) por Setembro 2026:
17 colunas geradas a partir do calendário real — quartas 2/9/16/23/30,
quintas 3/10/17/24, sextas 4/11/18/25, sábados 5/12/19/26.
Quarta a sexta 18:00 e 19:00; sábados 14:00–18:00. Cada slot tem a mensagem
de WhatsApp pré-preenchida com o dia e hora correctos.

## 5. Correcções de qualidade detectadas na auditoria
- **11 atributos `class` duplicados** no mesmo elemento
  (ex. `class="text-center" class="u-txt-nota"`). O browser ignora o segundo,
  pelo que havia estilos que nunca chegavam a aplicar-se.
- `<strong></strong>` vazio no subtítulo da depilação a laser.
- Label "vagas" em falta em Janeiro, Fevereiro, Março e Abril no calendário laser.
- Badge "Completa" com a classe visual de "Livre" (Mov Full Body).
- `.mod-fullbody` era `#1e40af` — azul saturado fora da paleta da marca e
  divergente do PDF. Passou a `#44637A` (ardósia dessaturada). Legenda actualizada.
- `.semana-grid` e `.massagem-mes-grid` esticavam as colunas até à altura da mais
  cheia → `align-items: start`.
- Contradição de duração das massagens: cabeçalho dizia 60 min, caixa informativa
  dizia 50 min. Uniformizado em 60 min — **a confirmar**.

## Por decidir (não alterado)
1. **Telefone divergente:** o PDF indica 961 672 661; todo o site usa 966 201 175.
2. **Sábado à tarde:** rodapé e secção de funcionamento indicam "Sábado
   09:00–13:00", mas o horário de massagens oferece sábados das 14:00 às 18:00.

## Testes realizados
Render em Chromium a 1440 px e 390 px com scroll completo (lazy loading forçado).
As 11 páginas verificadas: 0 erros de JavaScript, 0 imagens em falta,
0 overflow horizontal.

---

# Actualização — 19 de Setembro de 2026 (2)

## Massagens — calendário fixo ocultado
O studio está de momento a trabalhar as massagens **apenas por marcação directa**,
sem horário fixo publicado. A grelha de dias/horas de Setembro 2026 foi
**comentada em HTML** (não apagada) em `pages/horarios.html`, dentro de
`<!-- CALENDÁRIO DE MASSAGENS — Setembro 2026 ... -->`, para poder ser
reactivada facilmente assim que a Cecília voltar a ter horário fixo — basta
remover o comentário e a `<div class="mes-bloco reveal por-marcacoes">` que o
substitui.
No lugar da grelha, mostra-se um aviso "Disponibilidade por marcação" com CTA
directo para o WhatsApp. Estilos novos em `assets/css/horarios.css`
(`.por-marcacoes*`).

## "Horário em vigor" corrigido
Passou de "desde 18 de setembro de 2026" para "**no mês de setembro de
2026**" — mais rigoroso, já que o horário cobre o mês inteiro e não apenas
uma data de início.

## Confirmado (não alterado)
- Telefone: **966 201 175** mantém-se — já estava correcto em todo o site.
- Sábado: horário de funcionamento mantém-se **09:00–13:00**; só se altera
  havendo marcações fora desse período.

---

# Actualização — 19 de Setembro de 2026 (3)

## Janelas horárias de massagens — ocultadas
As referências a horas fixas de massagem (Quarta/Quinta/Sexta 18h–19h,
Sábado 14h–18h) foram comentadas em `pages/horarios.html`, em três pontos:
1. Linha de dias/horas no subtítulo da secção;
2. Bloco `.legenda` com os quatro dias e horas;
3. Caixa `.u-aviso-info` ("Sessões de 60 minutos, de Quarta a Sexta...").

Motivo: podiam cruzar-se com o horário de funcionamento do studio (ex. Sábado
14h–18h vs. studio fecha às 13h) e gerar confusão, já que de momento só se
trabalha por marcação directa. A secção mostra agora apenas
"Cecília Pinto · Terapeuta Certificada · Sessões de 60 min" seguido do aviso
"Disponibilidade por marcação" com CTA para o WhatsApp — sem indicar horas.
Todo o conteúdo comentado fica pronto a reactivar assim que o horário fixo
voltar.
