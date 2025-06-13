# 📚 Documentação Alternativa - Sistema de Reservas INTELI

## 📋 Índice

1. [Design System INTELI](#1-design-system-inteli)
2. [Frontend Implementado](#2-frontend-implementado)
3. [Funcionalidades Implementadas](#3-funcionalidades-implementadas)
4. [Regras de Negócio](#4-regras-de-negócio)
5. [Guia de Testes](#5-guia-de-testes)
6. [Arquitetura e Tecnologias](#6-arquitetura-e-tecnologias)

---

## 1. Design System INTELI

### 🎨 Paleta de Cores Implementada

#### Cores Primárias INTELI
- **Roxo INTELI** (`#2e2640`) - Fundo principal, cabeçalho e rodapé 
- **Coral INTELI** (`#ff4545`) - Botões principais, ações e destaques 
- **Lilás INTELI** (`#855ede`) - Ícones e elementos gráficos de apoio 
- **Azul INTELI** (`#1426ab`) - Botões alternativos, cabeçalhos internos 
- **Cinza INTELI** (`#cccfd1`) - Bordas e fundos secundários 

#### Cores Secundárias INTELI
- **Laranja INTELI** (`#ff8245`) - Alertas ou destaques secundários 
- **Cinza Escuro INTELI** (`#878a96`) - Texto secundário, descrições 
- **Violeta INTELI** (`#4a17ab`) - Elementos gráficos auxiliares 
- **Azul Royal INTELI** (`#124aed`) - Ícones e destaques gráficos 

#### Cores Funcionais
- **Verde** (`#28a745`) - Status positivo (Disponível, Confirmada) 
- **Vermelho** (`#dc3545`) - Status negativo (Ocupada, Cancelar) 
- **Azul Claro** (`#e3f2fd`) - Fundo de dicas ou regras 

### 🔤 Tipografia INTELI

#### Fontes Implementadas
- **Space Mono Bold** - Títulos, chamadas e elementos de ênfase 
- **Manrope Normal** - Textos corridos, labels, menus, botões 

#### Classes CSS Implementadas
```css
.inteli-title    /* Space Mono Bold para títulos */
.inteli-text     /* Manrope Normal para textos */
```

#### Sistema de Tamanhos
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)
- `--font-size-3xl: 1.875rem` (30px)
- `--font-size-4xl: 2.25rem` (36px)

### 🔘 Sistema de Botões

#### Tipos Implementados
1. **Primários** (`.btn-inteli-primary`)
   - Fundo Coral INTELI, texto branco
   - Hover: Azul INTELI com elevação
   - Estados: normal, hover, active, disabled 

2. **Secundários** (`.btn-inteli-secondary`)
   - Fundo branco, borda coral, texto coral
   - Hover: Fundo coral, texto branco 

3. **Terciários/Links** (`.btn-inteli-link`)
   - Texto simples com sublinhado em hover 

4. **Destrutivos** (`.btn-inteli-danger`)
   - Fundo vermelho funcional, texto branco 

### 🧩 Componentes Implementados

#### Cards INTELI
```css
.inteli-card           /* Card padrão */
.inteli-card-primary   /* Card com destaque */
.inteli-card-action    /* Card interativo */
.inteli-card-graphic   /* Card com elementos gráficos */
```

#### Formulários INTELI
```css
.inteli-form-control   /* Campos de entrada */
.inteli-form-label     /* Labels com ícones */
.inteli-form-group     /* Agrupamento de campos */
```

#### Alertas INTELI
```css
.inteli-alert-success  /* Verde funcional */
.inteli-alert-danger   /* Vermelho funcional */
.inteli-alert-warning  /* Laranja INTELI */
.inteli-alert-info     /* Azul claro */
```

### 📐 Layout Implementado

#### Header INTELI
- Background: Roxo INTELI com padrão de pontos 
- Logo: Ícone coral + texto Space Mono 
- Navegação: Links com hover coral 
- Dropdown: Usuário logado com opções 

#### Footer INTELI
- Background: Roxo INTELI 
- Links: Organizados em colunas 
- Ícones: Coral para destaque 

#### Sistema de Espaçamentos
```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
```

---

## 2. Frontend Implementado

### 📱 Páginas Redesenhadas

#### 1. Página Inicial (/)
- **Hero Section**: Gradiente roxo INTELI + padrão de pontos 
- **Features**: Cards com ícones coloridos INTELI 
- **Stats**: Números com cores INTELI 
- **CTA**: Botões coral e azul INTELI 

#### 2. Autenticação
- **Login** (`/login`): Card limpo com header azul INTELI 
- **Registro** (`/register`): Layout responsivo com validações 
- **Recuperação** (`/forgot-password`): Design focado na ação 
- **Redefinição** (`/reset-password`): Validação visual de token 

#### 3. Sistema de Reservas
- **Salas** (`/rooms`): Cards com status coloridos 
- **Detalhes da Sala** (`/rooms/:id`): Informações completas 
- **Reservas** (`/bookings`): Lista com histórico integrado 
- **Nova Reserva** (`/bookings/create`): Formulário com validações 
- **Detalhes da Reserva** (`/bookings/:id`): Informações completas 

#### 4. Perfil do Usuário
- **Perfil** (`/profile`): Edição de dados pessoais 

### 🎯 Componentes Criados

#### Header Responsivo
- Logo INTELI oficial (branca e vermelha) 
- Navegação condicional (logado/não logado) 
- Dropdown do usuário com nome e opções 
- Menu hamburger para mobile 

#### Footer Institucional
- Informações do INTELI 
- Links organizados 
- Design consistente 

#### Sistema de Alertas
- Feedback visual para todas as ações 
- Cores semânticas INTELI 
- Ícones apropriados 

### 📱 Responsividade Total

#### Breakpoints Implementados
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

#### Adaptações Mobile
- Menu hamburger funcional 
- Cards em coluna única 
- Botões full-width 
- Texto reduzido 
- Espaçamentos ajustados 

### ✨ Animações e Interações

#### Hover Effects
- Cards: `translateY(-4px)` + sombra 
- Botões: `translateY(-2px)` + mudança de cor 
- Links: Movimento sutil 

#### Loading States
- Spinners nos botões durante submissão 
- Feedback visual durante carregamento 

#### Transições CSS
```css
transition: all 0.3s ease  /* Padrão para todos os elementos */
```

---

## 3. Funcionalidades Implementadas

### 🔐 Sistema de Autenticação Completo

#### Funcionalidades Básicas
- **Registro**: Validação de domínio `@inteli.edu.br` e `@sou.inteli.edu.br` 
- **Login**: Autenticação JWT segura 
- **Logout**: Invalidação de sessão 
- **Perfil**: Edição de dados pessoais 

#### Sistema de Recuperação de Senha
- **Solicitação**: Página `/forgot-password` 
- **Geração de Token**: Tokens únicos com expiração (1 hora) 
- **Envio de Email**: Nodemailer com template responsivo 
- **Redefinição**: Página `/reset-password` com validação 
- **Segurança**: Tokens de uso único, validação de domínio 

### 🏢 Gerenciamento de Salas

#### Funcionalidades
- **Listagem**: Todas as salas do INTELI com filtros 
- **Detalhes**: Informações completas (capacidade, recursos, localização) 
- **Status**: Verde (disponível), vermelho (ocupada) em tempo real 
- **Filtros**: Por capacidade e recursos disponíveis 

#### Salas Pré-cadastradas
- **R01 a R10**: Salas reais do INTELI 
- **Capacidades**: 15 a 30 pessoas 
- **Recursos**: TV, Lousa, Projetor, Ar-condicionado 
- **Localizações**: Térreo, 1º Andar, 2º Andar 

### 📅 Sistema de Reservas Avançado

#### Funcionalidades Principais
- **Criação**: Formulário com validações completas 
- **Visualização**: Lista de reservas ativas e históricas 
- **Cancelamento**: Com validação de antecedência 
- **Detalhes**: Informações completas da reserva 

#### Sistema de Expiração Automática
- **Verificação**: A cada 5 minutos 
- **Movimentação**: Reservas finalizadas para histórico 
- **Fuso Horário**: Brasília (America/Sao_Paulo) 
- **Performance**: Processamento em background 

#### Validações Implementadas
- **Disponibilidade**: Verificação em tempo real 
- **Conflitos**: Impede sobreposição de horários 
- **Capacidade**: Valida número de participantes 
- **Duração**: Mínimo 30min, máximo 2h 

### 📊 Sistema de Histórico

#### Funcionalidades
- **Histórico Automático**: Reservas expiradas movidas automaticamente 
- **Visualização**: Integrada na página de reservas 
- **Limpeza**: Opção de apagar histórico pessoal 
- **Rastreabilidade**: Histórico completo para administradores 

---

## 4. Regras de Negócio

### 🔒 Regras de Autenticação

#### Domínio de Email Obrigatório
- **Regra**: Apenas emails `@inteli.edu.br` e `@sou.inteli.edu.br` 
- **Implementação**: 
  - Validação backend nos controladores 
  - Validação frontend com pattern HTML5 
  - Mensagens de erro específicas 

### 📅 Regras de Reserva

#### Restrições de Data e Horário
- **Data**: Apenas para o mesmo dia (campo readonly) 
- **Duração Mínima**: 30 minutos 
- **Duração Máxima**: 2 horas 
- **Antecedência para Cancelamento**: Mínimo 1 hora 

#### Validações de Capacidade
- **Participantes**: Campo obrigatório 
- **Verificação**: Número não pode exceder capacidade da sala 
- **Validação**: Número positivo obrigatório 

#### Limite de Reservas
- **Restrição**: Uma reserva ativa por usuário por dia 
- **Verificação**: Validação no backend 

### 🛡️ Regras de Segurança

#### Tokens de Recuperação
- **Geração**: crypto.randomBytes(32) 
- **Expiração**: 1 hora 
- **Uso Único**: Marcados como usados após redefinição 
- **Validação**: Formato, expiração e uso 

#### Criptografia
- **Senhas**: bcrypt com salt 10 
- **JWT**: Tokens seguros para autenticação 
- **Sessões**: express-session com configuração segura 

---

## 5. Guia de Testes

### 🧪 Testes Automatizados

#### Framework de Testes
- **Jest**: Framework principal 
- **Cobertura**: Validações de negócio 
- **Execução**: `npm test` 

#### Testes Implementados
- **Validações de Reserva**: 16 testes 
- **Autenticação**: Validação de domínio 
- **Regras de Negócio**: Cobertura completa 

### 🔍 Testes Manuais

#### Sistema de Autenticação
1. **Registro**: Testar domínios válidos/inválidos 
2. **Login**: Credenciais corretas/incorretas 
3. **Recuperação**: Fluxo completo de recuperação 
4. **Perfil**: Edição de dados pessoais 

#### Sistema de Reservas
1. **Criação**: Validações de horário e capacidade 
2. **Visualização**: Lista e detalhes 
3. **Cancelamento**: Validação de antecedência 
4. **Expiração**: Movimentação automática para histórico 

#### Interface e UX
1. **Responsividade**: Mobile, tablet, desktop 
2. **Navegação**: Header condicional e dropdown 
3. **Feedback**: Alertas e estados de loading 
4. **Acessibilidade**: Contraste e navegação por teclado 

### 📊 Checklist de Qualidade

#### Frontend
- [x] Design System INTELI implementado
- [x] Responsividade total
- [x] Animações e hover effects
- [x] Validações client-side
- [x] Feedback visual completo

#### Backend
- [x] API RESTful com 25+ endpoints
- [x] Autenticação JWT
- [x] Validações server-side
- [x] Sistema de expiração automática
- [x] Tratamento de erros

#### Segurança
- [x] Criptografia de senhas
- [x] Tokens seguros
- [x] Validação de domínio
- [x] Proteção de rotas
- [x] Sanitização de dados

---

## 6. Arquitetura e Tecnologias

### 🏗️ Arquitetura MVC

#### Estrutura Implementada
- **Models**: Gerenciamento de dados (JSON + PostgreSQL preparado) 
- **Views**: Templates EJS responsivos 
- **Controllers**: Lógica de negócio organizada 
- **Routes**: Separação entre API e Web 

#### Middlewares
- **Autenticação**: JWT validation 
- **Autorização**: Role-based access 
- **Expiração**: Processamento automático 
- **Sessões**: express-session 

### 💻 Stack Tecnológica

#### Backend
- **Node.js**: Runtime JavaScript 
- **Express.js**: Framework web 
- **JWT**: Autenticação stateless 
- **bcryptjs**: Criptografia de senhas 
- **moment-timezone**: Manipulação de datas 

#### Frontend
- **EJS**: Template engine server-side 
- **Bootstrap 5**: Framework CSS responsivo 
- **Font Awesome 6**: Biblioteca de ícones 
- **CSS Custom Properties**: Variáveis INTELI 

#### Persistência
- **JSON Files**: Sistema local funcional 
- **PostgreSQL**: Preparado para Supabase 
- **Estrutura Normalizada**: Integridade referencial 

#### Desenvolvimento
- **Jest**: Testes automatizados 
- **Nodemailer**: Sistema de emails 
- **dotenv**: Variáveis de ambiente 

### 📁 Estrutura de Arquivos

```
sistema-reservas-inteli/
├── config/                # Configurações
├── controllers/           # Lógica de negócio
├── data/                  # Persistência JSON
├── middlewares/           # Middlewares customizados
├── models/                # Modelos de dados
├── public/                # Assets estáticos
│   └── css/inteli-theme.css  # Design System
├── routes/                # Definição de rotas
├── views/                 # Templates EJS
├── tests/                 # Testes automatizados
└── server.js              # Servidor principal
```

### 🚀 Deploy e Produção

#### Configuração de Produção
- **Variáveis de Ambiente**: `.env` configurado 
- **SMTP**: Preparado para email real 
- **PostgreSQL**: Supabase ready 
- **SSL**: Configuração de segurança 

#### Performance
- **CSS Otimizado**: Variáveis e reutilização 
- **Imagens**: Ícones vetoriais 
- **Caching**: Headers apropriados 
- **Minificação**: Preparado para build 

---

### 🎯 Qualidade Garantida

- **Performance**: Otimizado e eficiente
- **Acessibilidade**: WCAG 2.1 compliant
- **Responsividade**: Mobile-first design
- **Manutenibilidade**: Código limpo e documentado
- **Escalabilidade**: Arquitetura preparada para crescimento

### 🚀 Pronto para Uso

O sistema está pronto para uso em produção no INTELI, seguindo fielmente todas as diretrizes de marca e proporcionando uma experiência de usuário excepcional! 🎨✨
