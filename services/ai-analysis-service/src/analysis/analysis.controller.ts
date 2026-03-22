import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async getBySurvey(@Query('surveyId') surveyId: string) {
    return this.analysisService.getResultsBySurvey(surveyId);
  }

  @Post('generate')
  async generate(@Body() body: { surveyId: string }) {
    // ← CHANGED THIS LINE
    console.log('📥 Received surveyId:', body.surveyId); // ← optional debug log
    return this.analysisService.generateSurveySummary(body.surveyId); // ← body.surveyId
  }
}
