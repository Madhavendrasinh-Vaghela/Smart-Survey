import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  createSurvey(@Body() body: any, @Req() req: any) {
    const token = req.headers.authorization;
    return this.surveyService.createSurvey(body, token);
  }

  @Get()
  getSurveys(@Req() req: any) {
    const token = req.headers.authorization;
    return this.surveyService.getSurveys(token);
  }
}
