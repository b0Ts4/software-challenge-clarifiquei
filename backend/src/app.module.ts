import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EngineersModule } from './engineers/engineers.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [DatabaseModule, EngineersModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
