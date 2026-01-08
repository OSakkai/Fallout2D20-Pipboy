import { Module } from '@nestjs/common';
import { FactionsController } from './factions.controller';
import { FactionsService } from './factions.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FactionsController],
  providers: [FactionsService],
  exports: [FactionsService],
})
export class FactionsModule {}
