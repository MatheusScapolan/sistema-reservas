# Novas Funcionalidades Implementadas

Este documento descreve as novas funcionalidades implementadas no Sistema de Reservas INTELI.

## 1. Melhorias no Header

### 1.1 Remoção do Botão Histórico
- **Removido**: Botão "Histórico" do menu de navegação
- **Removido**: Página `/history` e view `history.ejs`
- **Mantido**: Funcionalidade de histórico na página de reservas (`/bookings`)

### 1.2 Novo Sistema de Usuário no Header
- **Botão Usuário**: Quando não logado, exibe "Usuário"
- **Nome do Usuário**: Quando logado, exibe os dois primeiros nomes do usuário
- **Dropdown**: Menu dropdown com opções:
  - "Perfil" - leva para `/profile`
  - "Sair" - faz logout e redireciona para `/login`

### 1.3 Navegação Condicional
- **Não autenticado**: Mostra apenas "Início", "Login" e "Cadastro"
- **Autenticado**: Mostra "Início", "Salas", "Reservas" e dropdown do usuário

## 2. Sistema de Recuperação de Senha

### 2.1 Funcionalidades Implementadas
- ✅ Página "Esqueci minha senha" (`/forgot-password`)
- ✅ Geração de token de recuperação único
- ✅ Envio de email com link de recuperação
- ✅ Validação de token com expiração (1 hora)
- ✅ Página de redefinição de senha (`/reset-password`)
- ✅ Validação de domínio de email (@sou.inteli.edu.br)

### 2.2 Fluxo de Recuperação
1. **Solicitação**: Usuário acessa `/forgot-password` e informa email
2. **Validação**: Sistema valida domínio e existência do email
3. **Token**: Gera token único com expiração de 1 hora
4. **Email**: Envia email com link de recuperação
5. **Redefinição**: Usuário acessa link e define nova senha
6. **Confirmação**: Token é marcado como usado e senha atualizada

### 2.3 Segurança
- **Tokens únicos**: Gerados com crypto.randomBytes(32)
- **Expiração**: Tokens expiram em 1 hora
- **Uso único**: Tokens são marcados como usados após redefinição
- **Validação de domínio**: Apenas emails @sou.inteli.edu.br
- **Não revelação**: Sistema não revela se email existe ou não

## 3. Arquivos Criados/Modificados

### 3.1 Novos Arquivos
- `models/PasswordResetToken.js` - Modelo para tokens de recuperação
- `services/emailService.js` - Serviço de envio de emails
- `controllers/PasswordResetController.js` - Controlador de recuperação
- `routes/passwordResetRoutes.js` - Rotas da API para recuperação
- `views/forgot-password.ejs` - Página "Esqueci minha senha"
- `views/reset-password.ejs` - Página de redefinição de senha
- `data/password_reset_tokens.json` - Armazenamento de tokens

### 3.2 Arquivos Modificados
- `views/partials/header.ejs` - Novo header com dropdown do usuário
- `views/login.ejs` - Adicionado link "Esqueci minha senha"
- `routes/webRoutes.js` - Rotas para recuperação de senha
- `server.js` - Inclusão das novas rotas
- `package.json` - Dependências nodemailer e crypto

### 3.3 Arquivos Removidos
- `views/history.ejs` - Página de histórico removida

## 4. Dependências Adicionadas

### 4.1 Nodemailer
- **Versão**: Latest
- **Uso**: Envio de emails de recuperação
- **Configuração**: Conta de teste Ethereal para desenvolvimento

### 4.2 Crypto (Built-in)
- **Uso**: Geração de tokens seguros
- **Método**: crypto.randomBytes(32).toString('hex')

## 5. Configuração de Email

### 5.1 Desenvolvimento
- **Serviço**: Ethereal Email (teste)
- **Configuração**: Automática via nodemailer.createTestAccount()
- **Preview**: URLs de preview são exibidas no console

### 5.2 Produção
- **Configuração**: Variáveis de ambiente
  - `SMTP_HOST` - Servidor SMTP
  - `SMTP_PORT` - Porta SMTP
  - `SMTP_USER` - Usuário SMTP
  - `SMTP_PASS` - Senha SMTP
  - `FROM_EMAIL` - Email remetente
  - `BASE_URL` - URL base da aplicação

## 6. Rotas Implementadas

### 6.1 Rotas Web
- `GET /forgot-password` - Página de solicitação de recuperação
- `POST /forgot-password` - Processar solicitação de recuperação
- `GET /reset-password` - Página de redefinição (com token)
- `POST /reset-password` - Processar redefinição de senha

### 6.2 Rotas API
- `POST /api/password-reset/request` - Solicitar recuperação
- `GET /api/password-reset/validate/:token` - Validar token
- `POST /api/password-reset/reset` - Redefinir senha

## 7. Validações Implementadas

### 7.1 Email
- Domínio obrigatório: @sou.inteli.edu.br
- Formato válido de email
- Existência no sistema (sem revelação)

### 7.2 Token
- Formato hexadecimal de 64 caracteres
- Não expirado (< 1 hora)
- Não utilizado anteriormente

### 7.3 Senha
- Mínimo 6 caracteres
- Confirmação de senha obrigatória
- Criptografia bcrypt com salt

## 8. Interface do Usuário

### 8.1 Design Responsivo
- Bootstrap 5 para estilização
- Formulários com validação HTML5
- Feedback visual com spinners
- Mensagens de erro/sucesso

### 8.2 Experiência do Usuário
- Validação em tempo real
- Indicadores de carregamento
- Mensagens claras e específicas
- Navegação intuitiva

## 9. Testes

### 9.1 Teste Manual
1. Acesse `/forgot-password`
2. Digite um email válido (@sou.inteli.edu.br)
3. Verifique o console para o link de preview
4. Acesse o link de recuperação
5. Defina uma nova senha
6. Faça login com a nova senha

### 9.2 Teste de Segurança
- Tokens expirados são rejeitados
- Tokens usados são rejeitados
- Emails inválidos são rejeitados
- Senhas fracas são rejeitadas

## 10. Logs e Monitoramento

### 10.1 Logs de Email
- Inicialização do serviço de email
- URLs de preview (desenvolvimento)
- Erros de envio de email

### 10.2 Logs de Segurança
- Tentativas de recuperação
- Tokens inválidos/expirados
- Redefinições de senha bem-sucedidas

## 11. Manutenção

### 11.1 Limpeza de Tokens
- Função `cleanExpiredTokens()` disponível
- Remove tokens expirados automaticamente
- Pode ser executada periodicamente

### 11.2 Monitoramento
- Verificar logs de email
- Monitorar tentativas de recuperação
- Validar funcionamento do SMTP
