import { Module } from '@nestjs/common';
import { PerksService } from './perks.service';
import { PerksController } from './perks.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PerksController],
  providers: [PerksService],
  exports: [PerksService],
})
export class PerksModule {}
