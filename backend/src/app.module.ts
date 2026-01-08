import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CharactersModule } from './modules/characters/characters.module';
import { ItemsModule } from './modules/items/items.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PartiesModule } from './modules/parties/parties.module';
import { EncyclopediaModule } from './modules/encyclopedia/encyclopedia.module';
import { FactionsModule } from './modules/factions/factions.module';
import { PerksModule } from './modules/perks/perks.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CharactersModule,
    ItemsModule,
    WebsocketModule,
    PartiesModule,
    EncyclopediaModule,
    FactionsModule,
    PerksModule,
  ],
})
export class AppModule {}
