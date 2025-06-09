# Design System INTELI - Sistema de Reservas

Este documento descreve o design system implementado para o Sistema de Reservas INTELI, seguindo as diretrizes visuais e de marca da instituição.

## 🎨 Paleta de Cores

### Cores Primárias
- **INTELI Blue Primary**: `#0066CC` - Cor principal da marca
- **INTELI Blue Dark**: `#004499` - Variação escura para contrastes
- **INTELI Blue Light**: `#3385D6` - Variação clara para hover states
- **INTELI Blue Lighter**: `#E6F2FF` - Background suave

### Cores Secundárias
- **INTELI Orange**: `#FF6B35` - Cor de destaque e CTAs
- **INTELI Orange Light**: `#FF8A5C` - Variação para hover
- **INTELI Orange Lighter**: `#FFF0EB` - Background suave

### Cores Neutras
- **Gray 900**: `#1A1A1A` - Textos principais
- **Gray 800**: `#2D2D2D` - Textos secundários
- **Gray 700**: `#404040` - Textos terciários
- **Gray 600**: `#666666` - Textos auxiliares
- **Gray 500**: `#808080` - Placeholders
- **Gray 400**: `#B3B3B3` - Bordas
- **Gray 300**: `#CCCCCC` - Divisores
- **Gray 200**: `#E6E6E6` - Backgrounds
- **Gray 100**: `#F5F5F5` - Backgrounds claros
- **Gray 50**: `#FAFAFA` - Background principal

### Cores de Status
- **Success**: `#28A745` - Sucesso
- **Warning**: `#FFC107` - Avisos
- **Danger**: `#DC3545` - Erros
- **Info**: `#17A2B8` - Informações

## 🔤 Tipografia

### Fontes
- **Primária**: Inter (textos gerais)
- **Secundária**: Poppins (títulos e destaques)

### Hierarquia
- **H1**: 36px (2.25rem) - Títulos principais
- **H2**: 30px (1.875rem) - Títulos de seção
- **H3**: 24px (1.5rem) - Subtítulos
- **H4**: 20px (1.25rem) - Títulos menores
- **H5**: 18px (1.125rem) - Labels importantes
- **H6**: 16px (1rem) - Labels normais
- **Body**: 16px (1rem) - Texto padrão
- **Small**: 14px (0.875rem) - Textos auxiliares

## 🧩 Componentes

### Botões

#### Primário
```css
.btn-inteli-primary
```
- Background: Gradiente azul INTELI
- Cor do texto: Branco
- Hover: Gradiente invertido + elevação

#### Secundário
```css
.btn-inteli-secondary
```
- Background: Gradiente laranja INTELI
- Cor do texto: Branco
- Hover: Gradiente invertido + elevação

#### Outline
```css
.btn-inteli-outline
```
- Background: Transparente
- Borda: Azul INTELI
- Hover: Background azul + texto branco

### Cards

#### Card Padrão
```css
.inteli-card
```
- Background: Branco
- Border-radius: 12px
- Box-shadow: Sombra média
- Hover: Elevação + sombra maior

#### Card Header
```css
.inteli-card-header
```
- Background: Gradiente azul INTELI
- Cor do texto: Branco
- Padding: 24px

### Formulários

#### Form Control
```css
.inteli-form-control
```
- Border: 2px sólida cinza
- Border-radius: 8px
- Focus: Borda azul + sombra suave

#### Form Label
```css
.inteli-form-label
```
- Font-weight: 500
- Cor: Cinza escuro
- Ícones: Font Awesome

### Alertas

#### Tipos Disponíveis
- `.inteli-alert-success` - Verde
- `.inteli-alert-danger` - Vermelho
- `.inteli-alert-warning` - Amarelo
- `.inteli-alert-info` - Azul

## 🏗️ Layout

### Header
- Background: Gradiente azul INTELI
- Sticky positioning
- Logo com ícone de graduação
- Navegação responsiva
- Dropdown de usuário

### Footer
- Background: Gradiente azul INTELI
- Links organizados em colunas
- Redes sociais
- Informações de copyright

### Seções
- **Hero**: Gradiente de fundo + CTA
- **Features**: Cards com ícones
- **Stats**: Números destacados
- **CTA**: Chamada para ação

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

### Adaptações Mobile
- Menu hamburger
- Cards em coluna única
- Botões full-width
- Texto reduzido
- Espaçamentos ajustados

## ✨ Animações

### Hover Effects
- Cards: `translateY(-4px)` + sombra
- Botões: `translateY(-2px)` + sombra
- Links: `translateY(-2px)`

### Loading States
- Spinners nos botões
- Feedback visual durante submissão

### Scroll Animations
- Fade-in para elementos
- Float animation para ilustrações

## 🎯 Ícones

### Biblioteca
- **Font Awesome 6.0** - Ícones consistentes
- **Tamanhos**: fa-sm, fa-lg, fa-2x, fa-3x, fa-10x
- **Cores**: Seguem paleta INTELI

### Uso Semântico
- `fa-home` - Início
- `fa-door-open` - Salas
- `fa-calendar-alt` - Reservas
- `fa-user` - Perfil
- `fa-sign-in-alt` - Login
- `fa-user-plus` - Registro
- `fa-key` - Recuperação de senha

## 🔧 Utilitários

### Classes de Cor
- `.inteli-text-primary` - Texto azul
- `.inteli-text-secondary` - Texto laranja
- `.inteli-bg-light` - Background claro

### Classes de Layout
- `.inteli-gradient-bg` - Background gradiente
- `.min-vh-50` - Altura mínima 50vh

## 📋 Checklist de Implementação

### ✅ Concluído
- [x] Paleta de cores INTELI
- [x] Tipografia Inter + Poppins
- [x] Componentes de botão
- [x] Sistema de cards
- [x] Formulários estilizados
- [x] Header responsivo
- [x] Footer completo
- [x] Página inicial (hero + features)
- [x] Páginas de autenticação
- [x] Sistema de alertas
- [x] Animações e hover effects
- [x] Responsividade mobile
- [x] Ícones Font Awesome

### 🔄 Próximas Melhorias
- [ ] Dark mode
- [ ] Mais animações de transição
- [ ] Componentes de loading
- [ ] Sistema de notificações
- [ ] Temas personalizáveis

## 🚀 Como Usar

### 1. Importar CSS
```html
<link rel="stylesheet" href="/css/inteli-theme.css">
```

### 2. Usar Classes
```html
<!-- Botão primário -->
<button class="btn btn-inteli-primary">
  <i class="fas fa-save me-2"></i>
  Salvar
</button>

<!-- Card -->
<div class="inteli-card">
  <div class="inteli-card-header">
    <h4>Título</h4>
  </div>
  <div class="inteli-card-body">
    Conteúdo
  </div>
</div>
```

### 3. Variáveis CSS
```css
/* Usar variáveis personalizadas */
.meu-componente {
  color: var(--inteli-blue-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

## 📞 Suporte

Para dúvidas sobre o design system:
- Consulte este documento
- Verifique os exemplos nas páginas
- Analise o código CSS em `/public/css/inteli-theme.css`
