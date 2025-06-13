# Sistema de Reservas INTELI

## Descrição

Este projeto é um sistema web para reserva de salas, desenvolvido como parte do Projeto Individual Integrado do Módulo 2025-1B do INTELI. O objetivo é criar uma aplicação completa com banco de dados, backend e frontend para gerenciar o agendamento e uso de salas compartilhadas, aplicando os conceitos aprendidos no módulo.

A plataforma permitirá aos usuários visualizar a disponibilidade das salas em tempo real, fazer reservas com base em critérios como data, horário, capacidade e recursos, e gerenciar seus próprios agendamentos.

## Estrutura de Pastas e Arquivos

O projeto segue o padrão MVC (Model-View-Controller) para organização do código:

```text
sistema-reservas-inteli/
├── assets/                # Recursos de documentação
│   ├── diagrama_mvc/         # Diagramas MVC
│   ├── diagrama_relacional/  # Diagramas relacionais
│   ├── personas/             # Personas do projeto
│   ├── prototipo_alta_fidelidade/  # Protótipos
│   └── wireframe/            # Wireframes
├── config/                # Configurações do sistema
│   └── database.js           # Configuração PostgreSQL (Supabase)
├── controllers/           # Controladores (lógica de negócio)
│   ├── AuthController.js     # Autenticação e autorização
│   ├── BookingController.js  # Gerenciamento de reservas
│   ├── BookingHistoryController.js  # Histórico de reservas
│   ├── PasswordResetController.js   # Recuperação de senha
│   ├── RoomController.js     # Gerenciamento de salas
│   └── UserController.js     # Gerenciamento de usuários
├── data/                  # Persistência de dados (JSON)
│   ├── booking_history.json  # Histórico de reservas
│   ├── bookings.json        # Dados das reservas
│   ├── password_reset_tokens.json  # Tokens de recuperação
│   ├── rooms.json           # Dados das salas
│   └── users.json           # Dados dos usuários
├── db/                    # Configurações de banco de dados
│   └── connection.js         # Pool de conexões PostgreSQL
├── middlewares/           # Middlewares de autenticação e serviços
│   ├── auth.js              # Verificação de JWT
│   └── bookingExpiration.js  # Middleware de expiração automática
├── models/                # Camada de acesso a dados
│   ├── BookingHistory.js    # Modelo de histórico
│   ├── Database.js          # Gerenciador central (Singleton)
│   ├── PasswordResetToken.js # Modelo de tokens de recuperação
│   ├── Room.js              # Modelo de salas
│   └── User.js              # Modelo de usuários
├── public/                # Arquivos estáticos
│   ├── css/                 # Estilos CSS
│   │   ├── inteli-theme.css    # Design System INTELI implementado
│   │   └── style.css           # Estilos adicionais
│   ├── images/              # Imagens e logos INTELI
│   │   ├── inteli-logo-branca-vermelha.png  # Logo oficial
│   │   ├── inteli-logo-branca.png           # Logo branca
│   │   └── inteli-logo.png                  # Logo padrão
│   └── js/                  # Scripts JavaScript client-side
│       └── main.js             # Scripts principais
├── routes/                # Definição de rotas
│   ├── authRoutes.js        # Rotas de autenticação (/api/auth)
│   ├── bookingHistoryRoutes.js  # Rotas de histórico (/api/history)
│   ├── bookingRoutes.js     # Rotas de reservas (/api/bookings)
│   ├── index.js             # Agregador de rotas API (/api/*)
│   ├── passwordResetRoutes.js   # Rotas de recuperação de senha
│   ├── roomRoutes.js        # Rotas de salas (/api/rooms)
│   ├── userRoutes.js        # Rotas de usuários (/api/users)
│   └── webRoutes.js         # Rotas das páginas web (/*)
├── scripts/               # Scripts de banco de dados
│   └── init.sql              # Script de inicialização
├── services/              # Serviços de negócio
│   ├── bookingExpirationService.js  # Serviço de expiração
│   ├── emailService.js      # Serviço de email
│   └── userService.js       # Serviços de usuário
├── tests/                 # Testes automatizados
│   ├── bookingValidations.test.js  # Testes de validações
│   └── booking.test.js      # Testes de reservas
├── utils/                 # Utilitários
│   └── bookingValidations.js    # Validações de reservas
├── views/                 # Templates EJS
│   ├── partials/            # Componentes reutilizáveis
│   │   ├── footer.ejs          # Rodapé institucional
│   │   └── header.ejs          # Cabeçalho com navegação
│   ├── booking-create.ejs   # Criação de reserva
│   ├── booking-details.ejs  # Detalhes da reserva
│   ├── bookings.ejs         # Lista de reservas
│   ├── forgot-password.ejs  # Recuperação de senha
│   ├── index.ejs            # Página inicial
│   ├── login.ejs            # Página de login
│   ├── logout.ejs           # Página de logout
│   ├── profile.ejs          # Perfil do usuário
│   ├── register.ejs         # Página de registro
│   ├── reset-password.ejs   # Redefinição de senha
│   ├── room-details.ejs     # Detalhes da sala
│   └── rooms.ejs            # Lista de salas
├── .env                   # Variáveis de ambiente (não versionado)
├── .gitattributes         # Configurações Git
├── .gitignore             # Arquivos ignorados pelo Git
├── DOCUMENTACAO_ALTERNATIVA.md  # Documentação alternativa
├── init-db.js             # Script de inicialização do banco
├── jest.config.js         # Configuração de testes Jest
├── package.json           # Dependências e scripts NPM
├── package-lock.json      # Lock de dependências
├── README.md              # Documentação do projeto
├── save_inteli_logo.html  # Utilitário para salvar logo
├── seed-db.js             # Script de seed do banco
├── server.js              # Servidor principal Express
├── test_one_booking_per_day.js  # Teste específico
├── test-api.js            # Testes de API
├── test-endpoints.js      # Testes de endpoints
└── WAD.md                 # Documentação técnica WAD
```

## Funcionalidades

### 🔐 Autenticação e Autorização

- Cadastro de novos usuários com validação de email
- Login seguro com JWT (JSON Web Tokens)
- Gerenciamento de perfil do usuário
- Controle de acesso baseado em roles (usuário/admin)
- Logout seguro com invalidação de sessão

### 🏢 Gerenciamento de Salas

- Visualização de todas as salas disponíveis no INTELI
- Detalhes completos de cada sala (capacidade, localização, recursos)
- Filtros avançados por capacidade e recursos disponíveis
- Interface responsiva para diferentes dispositivos
- Informações em tempo real sobre disponibilidade

### 📅 Sistema de Reservas

- Criação de novas reservas com validação de conflitos
- Visualização de reservas ativas e históricas
- Cancelamento de reservas com confirmação
- Verificação de disponibilidade em tempo real
- **Expiração automática**: Reservas movidas automaticamente para histórico após término
- Notificações visuais sobre status das reservas
- Filtros por data, sala e status

### 📊 Relatórios e Histórico

- Histórico completo de todas as reservas
- Estatísticas de uso das salas
- Relatórios de reservas por usuário
- Dados de ocupação e disponibilidade

## Tecnologias Utilizadas

### Backend

- **Node.js**: Runtime JavaScript para servidor
- **Express.js**: Framework web para Node.js
- **JWT**: Autenticação baseada em tokens
- **bcryptjs**: Criptografia de senhas
- **moment-timezone**: Manipulação de datas e fusos horários

### Frontend

- **EJS**: Template engine para renderização server-side
- **Bootstrap 5**: Framework CSS responsivo
- **Font Awesome**: Biblioteca de ícones
- **JavaScript ES6+**: Interatividade e validações client-side

### Persistência

- **Sistema de arquivos JSON**: Armazenamento local de dados
- **Estrutura normalizada**: Organização eficiente dos dados

### Design e UX

- **Design System INTELI**: Cores e tipografia oficial
- **Interface responsiva**: Adaptável a diferentes dispositivos
- **Acessibilidade**: Seguindo boas práticas de UX/UI

## Requisitos

### Sistema

- **Node.js**: versão 14.0 ou superior
- **NPM**: versão 6.0 ou superior
- **Sistema Operacional**: Windows, macOS ou Linux

### Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Instalação

### 1. Obtenção do Código

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Ou extraia o arquivo ZIP fornecido
```

### 2. Instalação de Dependências

```bash
# Navegue até a pasta do projeto
cd sistema-reservas-inteli

# Instale as dependências
npm install
```

### 3. Configuração (Opcional)

```bash
# O sistema funciona com configurações padrão
# Porta padrão: 3000
# Dados iniciais já incluídos
```

### 4. Execução

```bash
# Inicie o servidor
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

### 5. Acesso

```text
http://localhost:3000
```

### Usuários Padrão para Teste

- **Admin**: admin@inteli.edu.br / admin123
- **Admin Estudantil**: admin@sou.inteli.edu.br / admin123

## Endpoints da API

### Autenticação

- `POST /api/auth/register`: Cadastro de novo usuário
- `POST /api/auth/login`: Login de usuário
- `GET /api/auth/verify`: Verificação de token JWT
- `GET /api/auth/profile`: Obtenção de perfil do usuário
- `PUT /api/auth/profile`: Atualização de perfil do usuário

### Salas

- `GET /api/rooms`: Lista todas as salas
- `GET /api/rooms/:id`: Obtém detalhes de uma sala específica
- `GET /api/rooms/capacity`: Filtra salas por capacidade
- `GET /api/rooms/resources`: Filtra salas por recursos disponíveis
- `POST /api/rooms`: Cria uma nova sala (apenas admin)
- `PUT /api/rooms/:id`: Atualiza uma sala (apenas admin)
- `DELETE /api/rooms/:id`: Exclui uma sala (apenas admin)

### Reservas

- `GET /api/bookings`: Lista todas as reservas do usuário
- `GET /api/bookings/:id`: Obtém detalhes de uma reserva específica
- `GET /api/bookings/user/:user_id`: Lista reservas de um usuário específico
- `GET /api/bookings/room/:room_id`: Lista reservas de uma sala específica
- `GET /api/bookings/date/:date`: Lista reservas de uma data específica
- `GET /api/bookings/check-availability`: Verifica disponibilidade de sala
- `POST /api/bookings`: Cria uma nova reserva
- `PUT /api/bookings/:id`: Atualiza uma reserva
- `PATCH /api/bookings/:id/status`: Atualiza o status de uma reserva
- `DELETE /api/bookings/:id`: Cancela uma reserva
- `POST /api/bookings/process-expired`: Processa reservas expiradas manualmente (apenas admin)
- `GET /api/bookings/expiration-stats`: Obtém estatísticas de expiração (apenas admin)
- `GET /api/bookings/:id/check-expiration`: Verifica se uma reserva específica está expirada

### Histórico de Reservas

- `GET /api/history`: Lista todo o histórico (apenas admin)
- `GET /api/history/:id`: Obtém detalhes de uma entrada do histórico
- `GET /api/history/booking/:booking_id`: Lista histórico de uma reserva específica
- `GET /api/history/user/:user_id`: Lista histórico de um usuário específico

## Rotas Web

- `/`: Página inicial
- `/login`: Página de login
- `/register`: Página de cadastro
- `/logout`: Rota de logout
- `/profile`: Página de perfil do usuário
- `/rooms`: Listagem de salas disponíveis
- `/rooms/:id`: Detalhes de uma sala específica
- `/bookings`: Listagem de reservas do usuário
- `/bookings/create`: Página de criação de reserva
- `/bookings/:id`: Detalhes de uma reserva específica
- `/bookings/:id/cancel`: Rota para cancelamento de reserva

## Observações

- O sistema utiliza persistência em arquivos JSON localizados na pasta `data/`
- As salas disponíveis são baseadas nas salas reais do INTELI
- O sistema implementa autenticação JWT para proteção das rotas
- Todas as operações de reserva verificam disponibilidade em tempo real
- Reservas expiradas são automaticamente processadas em background sem impactar a performance
- O sistema utiliza o fuso horário de Brasília (America/Sao_Paulo) para todas as operações de data/hora
- Interface desenvolvida seguindo o Design System oficial do INTELI
- Código organizado seguindo padrões de Clean Code e boas práticas de desenvolvimento
