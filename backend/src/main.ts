import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.100.111:5173',
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/,
    ],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Fallout 2d20 Pip-Boy API')
    .setDescription(`
      API REST para o sistema de RPG Fallout 2d20 Pip-Boy

      ## Features Implementadas
      - ✅ Sistema de autenticação JWT (Login/Register/Guest)
      - ✅ Criação completa de personagem via wizard (POST /characters/wizard)
      - ✅ Gerenciamento de personagens com SPECIAL, Skills, Derived Stats
      - ✅ Sistema de inventário por categoria (WEAPON, ARMOR, AID, MISC, AMMO)
      - ✅ Gerenciamento de partidas/campanhas com código único
      - ✅ Encyclopedia de dados do Fallout 2D20 Corebook
      - ✅ WebSocket real-time para sincronização de eventos

      ## Próximas Features
      - [ ] Endpoints para gerenciamento de campanhas (GM interface)
      - [ ] Sistema de convites para campanhas
      - [ ] Party Management (adicionar/remover jogadores)
      - [ ] Sistema de progressão de personagem (level up)
    `)
    .setVersion('2.0')
    .addTag('auth', 'Autenticação e gerenciamento de usuários')
    .addTag('characters', 'Gerenciamento de personagens (SPECIAL, HP, XP, Skills)')
    .addTag('campaigns', 'Gerenciamento de campanhas (GM) - Em desenvolvimento')
    .addTag('parties', 'Gerenciamento de partidas/sessões')
    .addTag('items', 'Gerenciamento de inventário por categoria')
    .addTag('encyclopedia', 'Consulta de dados do Fallout 2D20 Corebook (armas, armaduras, consumíveis, perks, etc)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Token JWT obtido no login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Fallout 2d20 API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api`);
}

bootstrap();
