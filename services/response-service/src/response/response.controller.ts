import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ResponseService } from './response.service';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async submitResponse(@Body() body: any) {
    if (body.responses && Array.isArray(body.responses)) {
      return this.responseService.createBatchResponse(
        body.surveyId,
        body.responses,
      );
    }
    return this.responseService.createResponse(body);
  }

  @Get()
  async getResponses(@Query('surveyId') surveyId: string) {
    return this.responseService.getResponsesBySurvey(surveyId);
  }
}
