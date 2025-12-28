# Backend - Fallout 2D20 Pip-Boy

Backend para sistema multiplayer do Pip-Boy.

## Planejamento

### Funcionalidades Planejadas

1. **Autenticação**
   - Sistema de login para GM e jogadores
   - Sessões de jogo
   - Permissões baseadas em role (GM/Player)

2. **Database (Firebase Realtime Database)**
   - Personagens dos jogadores
   - Estado da sessão de jogo
   - Inventário compartilhado
   - Quests ativas
   - Combate em tempo real

3. **API REST (Opcional)**
   - Endpoints para CRUD de personagens
   - Webhooks para eventos de jogo
   - Integração com outras ferramentas

### Estrutura Planejada

```
backend/
├── src/
│   ├── config/          # Configurações Firebase
│   ├── models/          # Models de dados
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # API routes
│   ├── services/        # Serviços (Firebase, etc)
│   └── middlewares/     # Auth, validação, etc
├── package.json
└── README.md
```

### Tecnologias Propostas

- Firebase Realtime Database
- Firebase Authentication
- Node.js + Express (opcional)
- TypeScript

## Status

🔄 **Em Planejamento** - Backend será implementado na próxima fase do projeto.
