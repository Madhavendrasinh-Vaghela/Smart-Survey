import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AnalysisService } from '../analysis/analysis.service';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  constructor(private readonly analysisService: AnalysisService) {}

  async onModuleInit() {
    const connection = await amqp.connect(
      'amqp://admin:admin@localhost:5672',
    );
    const channel = await connection.createChannel();

    await channel.assertQueue('RESPONSE_SUBMITTED');

    channel.consume('RESPONSE_SUBMITTED', async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log('📩 Event received:', data);

      await this.analysisService.processResponse(data);

      channel.ack(msg);
    });
  }
}
