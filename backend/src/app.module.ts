import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CharactersModule } from './modules/characters/characters.module';
import { ItemsModule } from './modules/items/items.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CharactersModule,
    ItemsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
