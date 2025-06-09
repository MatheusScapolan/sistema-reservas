# 🎨 Guia de Estilos – Sistema de Reservas de Salas do INTELI

## 📐 Layout Geral
✅ **Implementado**
- Design limpo com bom uso de espaço em branco
- Cards com cantos arredondados (`--radius-xl: 1rem`) e sombras sutis
- Margens e espaçamentos consistentes usando variáveis CSS
- Cabeçalho e rodapé fixos implementados
- Navegação clara e estrutura adaptável

## 🔤 Tipografia
✅ **Implementado**

### Fontes Principais:
- **Space Mono Bold**: títulos, chamadas e elementos de ênfase
  - Classe: `.inteli-title`
  - Variável: `--font-secondary`
  - Uso: Transmite modernidade e tecnologia

- **Manrope Normal**: textos corridos, labels, menus, botões
  - Classe: `.inteli-text`
  - Variável: `--font-primary`
  - Uso: Alta legibilidade

### Hierarquia Visual:
- Variação clara de tamanho e peso das fontes
- Tamanhos definidos: `--font-size-xs` até `--font-size-4xl`

## 🎨 Cores

### Primárias INTELI:
✅ **Implementado**
- **Roxo Inteli** (`#2e2640`): fundo principal, cabeçalho e rodapé
- **Coral Inteli** (`#ff4545`): botões principais, ações e destaques
- **Lilás Inteli** (`#855ede`): ícones e elementos gráficos de apoio
- **Azul Inteli** (`#1426ab`): botões alternativos, cabeçalhos internos
- **Cinza Inteli** (`#cccfd1`): bordas e fundos secundários

### Secundárias INTELI:
✅ **Implementado**
- **Laranja Inteli** (`#ff8245`): alertas ou destaques secundários
- **Cinza Escuro Inteli** (`#878a96`): texto secundário, descrições, placeholders
- **Violeta Inteli** (`#4a17ab`): elementos gráficos ou fundos auxiliares
- **Azul Royal Inteli** (`#124aed`): ícones e destaques gráficos

### Neutras e Funcionais:
✅ **Implementado**
- **Branco** (`#FFFFFF`): fundos e textos sobre escuro
- **Preto/Cinza Escuro**: textos sobre fundos claros
- **Verde** (`#28a745`): status positivo (Disponível, Confirmada)
- **Vermelho** (`#dc3545`): status negativo (Ocupada, Cancelar)
- **Azul Claro** (`#e3f2fd`): fundo de dicas ou regras

## 🔘 Botões
✅ **Implementado**

### Primários:
- Fundo Coral ou Azul Inteli, texto branco, com ícone
- Classe: `.btn-inteli-primary`
- Exemplo: "Reservar Agora"
- Estados: normal, hover, active, disabled

### Secundários:
- Fundo branco, borda e texto coloridos
- Classe: `.btn-inteli-secondary`
- Exemplo: "Cancelar"
- Estados visuais definidos

### Terciários/Links:
- Texto simples (Azul Inteli ou Lilás)
- Classe: `.btn-inteli-outline`
- Sublinhado em hover
- Exemplo: "Esqueci minha senha"

## 🧩 Assets Visuais
✅ **Implementado**

### Logotipo INTELI:
- Presente em cabeçalhos e telas de login
- Classe: `.inteli-logo`
- Respeito ao manual da marca

### Ícones:
- Estilo limpo e moderno (Font Awesome/Material Icons)
- Classe: `.inteli-icon`
- Usados para ações, status e funcionalidades

### Grafismos:
- Padrões sutis de pontos sobre fundos escuros
- Classe: `.inteli-gradient-bg`
- Conforme manual da marca

## 📊 Status e Estados
✅ **Implementado**

### Classes de Status:
- `.status-disponivel` - Verde
- `.status-ocupada` - Vermelho
- `.status-confirmada` - Verde
- `.status-cancelada` - Vermelho
- `.status-pendente` - Laranja

### Badges de Status:
- `.badge-status` - Base
- `.badge-disponivel` - Verde com fundo
- `.badge-ocupada` - Vermelho com fundo
- `.badge-confirmada` - Verde com fundo

## 🎯 Classes Utilitárias

### Cores de Texto:
- `.inteli-text-roxo`
- `.inteli-text-coral`
- `.inteli-text-lilas`
- `.inteli-text-azul`
- `.inteli-text-laranja`
- `.inteli-text-azul-royal`
- `.inteli-text-cinza`

### Cores de Fundo:
- `.inteli-bg-roxo`
- `.inteli-bg-coral`
- `.inteli-bg-lilas`
- `.inteli-bg-azul`
- `.inteli-bg-light`
- `.inteli-bg-white`

## 📱 Cards e Componentes

### Cards:
- `.inteli-card` - Card base
- `.inteli-card-primary` - Header roxo
- `.inteli-card-action` - Header coral
- `.inteli-card-graphic` - Header lilás
- `.inteli-card-compact` - Espaçamento reduzido
- `.inteli-card-elevated` - Sombra pronunciada

### Formulários:
- `.inteli-form-control` - Campos de entrada
- `.inteli-form-label` - Labels com ícones
- Estados de foco e validação

### Alertas:
- `.inteli-alert-success` - Verde
- `.inteli-alert-danger` - Vermelho
- `.inteli-alert-warning` - Laranja
- `.inteli-alert-info` - Azul claro

## 🚀 Implementação Completa

O guia de estilos foi totalmente implementado no arquivo `/public/css/inteli-theme.css` com:

1. ✅ Todas as cores primárias e secundárias
2. ✅ Tipografia Space Mono + Manrope
3. ✅ Sistema completo de botões
4. ✅ Cards com variações
5. ✅ Assets visuais e ícones
6. ✅ Status e estados visuais
7. ✅ Classes utilitárias
8. ✅ Padrões de pontos conforme manual
9. ✅ Espaçamentos consistentes
10. ✅ Sombras e bordas arredondadas

### Uso:
Todas as páginas do sistema agora seguem o guia de estilos oficial INTELI, garantindo consistência visual e identidade da marca em todo o sistema de reservas.
