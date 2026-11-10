# Assistente Virtual Terceiriza DP

Primeira estrutura do assistente conversacional integrado ao site institucional.

## Estado atual

- Widget flutuante em JavaScript puro, compatível com o site estático atual.
- Backend Node.js + Express.
- Integração com a API da OpenAI pelo servidor (a chave não vai para o navegador).
- Seleção entre visitante/empresário e funcionário.
- Consultas pessoais de funcionários ainda não estão habilitadas; exigem autenticação, autorização e integração com o sistema de folha.
- Histórico da conversa mantido temporariamente no navegador; não há persistência no banco nesta primeira etapa.

## Estrutura

- `widget.js` e `widget.css`: interface incorporável no site.
- `backend/src/server.js`: API HTTP.
- `backend/.env.example`: variáveis necessárias.

## Executar o backend localmente

1. Entre em `assistant/backend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env`.
4. Preencha `OPENAI_API_KEY` no arquivo `.env`.
5. Execute `npm run dev`.
6. Verifique `http://localhost:3001/api/health`.

## Integrar o widget ao site

Depois de iniciar o backend, adicione antes do fechamento de `</body>`:

```html
<script
  src="/assistant/widget.js"
  data-api-base="http://localhost:3001">
</script>
```

Em produção, substitua `data-api-base` pela URL HTTPS do backend publicado.

## Segurança e próximos passos

- Configure `ALLOWED_ORIGINS` com os domínios reais do site.
- Configure HTTPS no backend.
- Nunca publique `.env`, tokens ou chaves.
- Antes de liberar o modo funcionário com consultas individuais, implementar autenticação, autorização por empresa/funcionário, trilha de auditoria e integração aprovada com o sistema de folha.
- Revisar a base institucional e as respostas trabalhistas com a equipe da Terceiriza DP.
