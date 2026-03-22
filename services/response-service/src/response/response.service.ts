import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from './response.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name)
    private responseModel: Model<Response>,
    private rabbitMQService: RabbitMQService,
  ) {}

  
  async createResponse(data: any) {
    const response = new this.responseModel(data);
    const saved = await response.save();

    await this.rabbitMQService.publishResponseSubmitted({
      responseId: saved._id,
      surveyId: saved.surveyId,
      answers: saved.answers,
    });

    return saved;
  }

  async getResponsesBySurvey(surveyId: string) {
    return this.responseModel.find({ surveyId });
  }

  async createBatchResponse(surveyId: string, responses: any[]) {
    const docs = responses.map((r) => ({
      surveyId,
      userId: r.userId,
      answers: [{ questionId: 'q1', answer: r.answer }], // map answer → answers array
    }));

    const saved = await this.responseModel.insertMany(docs);

    // Emit one event per saved response
    for (const s of saved as any[]) {
      await this.rabbitMQService.publishResponseSubmitted({
        responseId: s._id,
        surveyId: s.surveyId,
        answers: s.answers,
      });
    }

    return { inserted: saved.length, data: saved };
  }
}
