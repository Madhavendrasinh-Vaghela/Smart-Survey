import { Controller, Post, Get, Body } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller('surveys')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  create(@Body() body: any) {
    return this.surveyService.createSurvey(body);
  }

  @Get()
  findAll() {
    return this.surveyService.getAllSurveys();
  }
}
