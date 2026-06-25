import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyResponse, ResponseDocument } from './response.schema';
import * as amqp from 'amqplib';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(SurveyResponse.name) private responseModel: Model<ResponseDocument>
  ) {}

  async create(data: any): Promise<SurveyResponse> {
    const saved = await new this.responseModel(data).save();
    await this.publishEvent(saved);
    return saved;
  }

  async findBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    return this.responseModel.find({ surveyId }).exec();
  }

  private async publishEvent(response: any) {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost'
      );
      const channel = await connection.createChannel();
      await channel.assertQueue('RESPONSE_SUBMITTED');
      channel.sendToQueue(
        'RESPONSE_SUBMITTED',
        Buffer.from(JSON.stringify({
          surveyId: response.surveyId,
          responseId: response._id,
          answers: response.answers,
        }))
      );
      console.log('Event published: RESPONSE_SUBMITTED', response._id);
      await channel.close();
      await connection.close();
    } catch (err) {
      console.error('RabbitMQ publish error:', err.message);
    }
  }
}