import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ResponseService } from './response.service';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responsesService: ResponseService) {}

  @Post()
  create(@Body() body: any) {
    return this.responsesService.create(body);
  }

  @Get()
  findBySurvey(@Query('surveyId') surveyId: string) {
    return this.responsesService.findBySurveyId(surveyId);
  }
}