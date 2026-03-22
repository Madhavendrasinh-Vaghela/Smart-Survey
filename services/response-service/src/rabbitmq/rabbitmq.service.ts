import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private channel: amqp.Channel;

  async onModuleInit() {
    const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('RESPONSE_SUBMITTED');
  }

  async publishResponseSubmitted(data: any) {
    this.channel.sendToQueue(
      'RESPONSE_SUBMITTED',
      Buffer.from(JSON.stringify(data)),
    );
  }
}
