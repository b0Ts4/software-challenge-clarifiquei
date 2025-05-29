import { Module } from '@nestjs/common';
import { EngineersService } from './engineers.service';
import { EngineersController } from './engineers.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EngineersService],
  controllers: [EngineersController],
})
export class EngineersModule {}
