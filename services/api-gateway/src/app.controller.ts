import {
  Controller, Get, Post, Put, Patch,
  Delete, Body, Param, Query,
  UseGuards, Req, HttpCode, HttpStatus
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly http: HttpService) {}

  // ─── AUTH ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: any) {
    return { message: 'Protected route accessed', user: req.user };
  }

  // ─── SURVEYS ──────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('surveys')
  @HttpCode(HttpStatus.CREATED)
  async createSurvey(@Body() body: any) {
    const res = await firstValueFrom(
      this.http.post(`${process.env.SURVEY_SERVICE_URL}/surveys`, body)
    );
    return res.data;
  }

  @Get('surveys/active')
  async getActiveSurveys() {
    const res = await firstValueFrom(
      this.http.get(`${process.env.SURVEY_SERVICE_URL}/surveys/active`)
    );
    return res.data;
  }

  @Get('surveys/count')
  async getSurveysCount() {
    const res = await firstValueFrom(
      this.http.get(`${process.env.SURVEY_SERVICE_URL}/surveys/count`)
    );
    return res.data;
  }

  @Get('surveys')
  async getSurveys(@Query('companyId') companyId?: string) {
    const res = await firstValueFrom(
      this.http.get(`${process.env.SURVEY_SERVICE_URL}/surveys`, {
        params: companyId ? { companyId } : {},
      })
    );
    return res.data;
  }

  @Get('surveys/:id')
  async getSurveyById(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.get(`${process.env.SURVEY_SERVICE_URL}/surveys/${id}`)
    );
    return res.data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('surveys/:id')
  async updateSurvey(@Param('id') id: string, @Body() body: any) {
    const res = await firstValueFrom(
      this.http.put(`${process.env.SURVEY_SERVICE_URL}/surveys/${id}`, body)
    );
    return res.data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('surveys/:id/toggle')
  async toggleSurvey(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.patch(`${process.env.SURVEY_SERVICE_URL}/surveys/${id}/toggle`)
    );
    return res.data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('surveys/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSurvey(@Param('id') id: string) {
    const res = await firstValueFrom(
      this.http.delete(`${process.env.SURVEY_SERVICE_URL}/surveys/${id}`)
    );
    return res.data;
  }

  // ─── RESPONSES ────────────────────────────────────────
  @Post('responses')
  async submitResponse(@Body() body: any) {
    const res = await firstValueFrom(
      this.http.post(`${process.env.RESPONSE_SERVICE_URL}/responses`, body)
    );
    return res.data;
  }

  @Get('responses')
  async getResponses(@Query('surveyId') surveyId: string) {
    const res = await firstValueFrom(
      this.http.get(`${process.env.RESPONSE_SERVICE_URL}/responses`, {
        params: { surveyId },
      })
    );
    return res.data;
  }

  // ─── AI ANALYSIS ──────────────────────────────────────
  @Get('analysis')
  async getAnalysis(@Query('surveyId') surveyId: string) {
    const res = await firstValueFrom(
      this.http.get(`${process.env.ANALYSIS_SERVICE_URL}/analysis`, {
        params: { surveyId },
      })
    );
    return res.data;
  }

  @Post('analysis/generate')
  async generateAnalysis(@Body() body: { surveyId: string }) {
    const res = await firstValueFrom(
      this.http.post(`${process.env.ANALYSIS_SERVICE_URL}/analysis/generate`, body)
    );
    return res.data;
  }
}