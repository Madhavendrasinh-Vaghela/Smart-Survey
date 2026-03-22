import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from './survey.schema';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
  ) {}

  createSurvey(data: any) {
    return this.surveyModel.create(data);
  }

  getAllSurveys() {
    return this.surveyModel.find();
  }
}
