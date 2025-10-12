# Status HTTP comuns para erros

- 400 Bad Request → O cliente enviou algo inválido (parâmetros errados, dados incompletos, etc.).
- 401 Unauthorized → Falta autenticação.
- 403 Forbidden → Cliente não tem permissão.
- 404 Not Found → Recurso não existe.
- 422 Unprocessable Entity → Dados são válidos sintaticamente, mas inválidos para o processamento.
- 500 Internal Server Error → Erro no servidor (como no seu caso).
- 503 Service Unavailable → Serviço indisponível temporariamente.
