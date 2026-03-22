import { Module } from '@nestjs/common';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { AnalysisModule } from '../analysis/analysis.module';

@Module({
  imports: [AnalysisModule],
  providers: [RabbitMQConsumer],
})
export class RabbitMQModule {}
