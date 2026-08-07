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
