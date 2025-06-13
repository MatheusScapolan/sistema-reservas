# Teste das Novas Funcionalidades

Este documento fornece um guia para testar todas as novas funcionalidades implementadas.

## 1. Preparação

1. Execute o servidor:
```bash
npm start
```

2. Acesse: http://localhost:3000

## 2. Teste do Novo Header

### 2.1 Usuário Não Logado
1. Acesse a página inicial
2. **Verificar**: Header mostra apenas "Início", "Login" e "Cadastro"
3. **Verificar**: Não há botão "Histórico"
4. **Verificar**: Não há dropdown de usuário

### 2.2 Usuário Logado
1. Faça login com um usuário existente
2. **Verificar**: Header mostra "Início", "Salas", "Reservas"
3. **Verificar**: Dropdown no canto direito com os dois primeiros nomes
4. **Verificar**: Dropdown contém "Perfil" e "Sair"

### 2.3 Navegação do Dropdown
1. Clique no dropdown do usuário
2. Clique em "Perfil" → deve ir para `/profile`
3. Clique em "Sair" → deve fazer logout e ir para `/login`

## 3. Teste do Sistema de Recuperação de Senha

### 3.1 Acesso à Página de Recuperação
1. Acesse `/login`
2. **Verificar**: Link "Esqueci minha senha" está presente
3. Clique no link
4. **Verificar**: Redireciona para `/forgot-password`

### 3.2 Teste com Email Inválido
1. Na página `/forgot-password`
2. Digite um email inválido (ex: `teste@gmail.com`)
3. Clique em "Enviar instruções"
4. **Resultado Esperado**: Erro "Apenas emails do domínio @sou.inteli.edu.br são permitidos"

### 3.3 Teste com Email Válido
1. Digite um email válido (ex: `teste@sou.inteli.edu.br`)
2. Clique em "Enviar instruções"
3. **Resultado Esperado**: Mensagem de sucesso
4. **Verificar**: Console do servidor mostra link de preview do email

### 3.4 Teste do Email de Recuperação
1. Copie o link de preview do console
2. Abra o link em uma nova aba
3. **Verificar**: Email contém:
   - Assunto: "Recuperação de Senha - Sistema de Reservas INTELI"
   - Botão "Redefinir Senha"
   - Aviso de expiração em 1 hora
   - Design responsivo

### 3.5 Teste de Redefinição de Senha
1. No email, clique em "Redefinir Senha"
2. **Verificar**: Redireciona para `/reset-password?token=...`
3. **Verificar**: Página mostra formulário de nova senha
4. Digite uma senha nova
5. Confirme a senha
6. Clique em "Redefinir senha"
7. **Resultado Esperado**: Sucesso e redirecionamento para login

### 3.6 Teste de Login com Nova Senha
1. Na página de login
2. Use o email e a nova senha
3. **Resultado Esperado**: Login bem-sucedido

## 4. Testes de Segurança

### 4.1 Token Inválido
1. Acesse `/reset-password?token=invalid`
2. **Resultado Esperado**: Mensagem "Token inválido ou expirado"
3. **Verificar**: Botão para solicitar nova recuperação

### 4.2 Token Expirado (Simulação)
1. Modifique manualmente um token no arquivo `data/password_reset_tokens.json`
2. Altere `expiresAt` para uma data passada
3. Tente acessar o link
4. **Resultado Esperado**: Token rejeitado

### 4.3 Token Já Usado
1. Use um token válido para redefinir senha
2. Tente usar o mesmo token novamente
3. **Resultado Esperado**: Token rejeitado

### 4.4 Senhas Não Coincidem
1. Na página de redefinição
2. Digite senhas diferentes nos campos
3. Tente submeter
4. **Resultado Esperado**: Validação impede submissão

## 5. Teste da API

### 5.1 Solicitar Recuperação via API
```bash
curl -X POST http://localhost:3000/api/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@sou.inteli.edu.br"}'
```

**Resultado Esperado**:
```json
{
  "success": true,
  "message": "Se o email estiver cadastrado, você receberá as instruções de recuperação"
}
```

### 5.2 Validar Token via API
```bash
curl http://localhost:3000/api/password-reset/validate/{TOKEN}
```

**Resultado Esperado**:
```json
{
  "success": true,
  "message": "Token válido"
}
```

### 5.3 Redefinir Senha via API
```bash
curl -X POST http://localhost:3000/api/password-reset/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "{TOKEN}",
    "password": "novaSenha123",
    "confirmPassword": "novaSenha123"
  }'
```

**Resultado Esperado**:
```json
{
  "success": true,
  "message": "Senha redefinida com sucesso"
}
```

## 6. Teste de Responsividade

### 6.1 Mobile
1. Abra as páginas em dispositivo móvel ou DevTools
2. **Verificar**: Header com menu hamburger funcional
3. **Verificar**: Formulários responsivos
4. **Verificar**: Dropdown do usuário funcional

### 6.2 Tablet
1. Teste em resolução de tablet
2. **Verificar**: Layout adequado
3. **Verificar**: Navegação funcional

## 7. Teste de Validações Frontend

### 7.1 Validação HTML5
1. Tente submeter formulários vazios
2. **Verificar**: Validação nativa do navegador
3. **Verificar**: Mensagens de erro apropriadas

### 7.2 Validação JavaScript
1. Digite senhas diferentes na redefinição
2. **Verificar**: Validação em tempo real
3. **Verificar**: Botão desabilitado se inválido

## 8. Checklist de Funcionalidades

### 8.1 Header
- [ ] Botão histórico removido
- [ ] Dropdown de usuário funcional
- [ ] Nome do usuário exibido corretamente
- [ ] Links de perfil e logout funcionais
- [ ] Navegação condicional (logado/não logado)

### 8.2 Recuperação de Senha
- [ ] Link na página de login
- [ ] Página de solicitação funcional
- [ ] Validação de domínio de email
- [ ] Geração de token
- [ ] Envio de email
- [ ] Página de redefinição funcional
- [ ] Validação de token
- [ ] Redefinição de senha
- [ ] Login com nova senha

### 8.3 Segurança
- [ ] Tokens únicos e seguros
- [ ] Expiração de tokens (1 hora)
- [ ] Tokens de uso único
- [ ] Validação de domínio
- [ ] Criptografia de senhas
- [ ] Não revelação de emails

### 8.4 API
- [ ] Endpoint de solicitação
- [ ] Endpoint de validação
- [ ] Endpoint de redefinição
- [ ] Respostas JSON corretas
- [ ] Códigos de status apropriados

## 9. Problemas Conhecidos

### 9.1 Email em Produção
- **Problema**: Configuração SMTP necessária para produção
- **Solução**: Configurar variáveis de ambiente SMTP

### 9.2 Limpeza de Tokens
- **Problema**: Tokens expirados não são limpos automaticamente
- **Solução**: Implementar job de limpeza periódica

## 10. Próximos Passos

1. **Configurar SMTP real** para produção
2. **Implementar limpeza automática** de tokens
3. **Adicionar logs de auditoria** para recuperações
4. **Implementar rate limiting** para prevenir spam
5. **Adicionar testes automatizados** para as novas funcionalidades
