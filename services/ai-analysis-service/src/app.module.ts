import { Module } from '@nestjs/common';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [PrismaModule, AnalysisModule, RabbitMQModule],
})
export class AppModule {}
