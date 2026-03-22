import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async getAnalysis(@Query('surveyId') surveyId: string) {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3005/analysis', {
        params: { surveyId },
      }),
    );
    return res.data;
  }

  @Get()
  async getBySurvey(@Query('surveyId') surveyId: string) {
    const res = await firstValueFrom(
      this.http.get('http://localhost:3005/analysis', {
        params: { surveyId },
      }),
    );
    return res.data;
  }

  //  MANUAL TRIGGER
  @Post('generate')
  async generate(@Body() body: { surveyId: string }) {
    console.log('🌐 Gateway received body:', body); // ← add this
    const res = await firstValueFrom(
      this.http.post(
        'http://localhost:3005/analysis/generate',
        body, // ← make sure full body is passed here
        { timeout: 180000 },
      ),
    );
    return res.data;
  }
}
