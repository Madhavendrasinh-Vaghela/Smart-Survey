import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // ✅ REAL-TIME (RabbitMQ) — just save to DB, NO BART call
  async processResponse(data: any) {
    await this.prisma.analysisResult.create({
      data: {
        surveyId: data.surveyId,
        responseId: data.responseId,
        sentiment: 'PENDING',
        summary: 'Awaiting batch analysis',  // ← placeholder, not BART
      },
    });

    console.log('📩 Response saved for later analysis:', data.responseId);
  }

  // ✅ BATCH SUMMARY — BART runs ONCE for all responses
  async generateSurveySummary(surveyId: string) {
    try {
      console.log('Fetching responses for surveyId:', surveyId);

      const responsesRes = await axios.get('http://localhost:3003/responses', {
        params: { surveyId },
        timeout: 10000,
      });

      console.log('Responses count:', responsesRes.data.length);

      const responses = responsesRes.data;

      if (!responses || responses.length === 0) {
        return { message: 'No responses found for this survey' };
      }

      const allAnswers = responses.flatMap((r) =>
        r.answers.map((a) => a.answer),
      );

      console.log('Total answers collected:', allAnswers.length);

      // ✅ BART called ONCE for all 19 answers
      const aiRes = await firstValueFrom(
        this.http.post(
          'http://localhost:3010/analyze',
          {
            surveyId,
            responses: allAnswers,
          },
          { timeout: 180000 },
        ),
      );

      // ✅ Update existing BATCH row if exists, else create new
      const existing = await this.prisma.analysisResult.findFirst({
        where: { surveyId, responseId: 'BATCH' },
      });

      const result = existing
        ? await this.prisma.analysisResult.update({
            where: { id: existing.id },
            data: { summary: aiRes.data.summary, sentiment: 'COMPLETED' },
          })
        : await this.prisma.analysisResult.create({
            data: {
              surveyId,
              responseId: 'BATCH',
              sentiment: 'COMPLETED',
              summary: aiRes.data.summary,
            },
          });

      return { message: 'Survey summary generated successfully', result };
    } catch (error) {
      console.error('❌ ERROR:', error.message);
      throw error;
    }
  }

  // ✅ FETCH RESULTS FOR UI / DASHBOARD
  async getResultsBySurvey(surveyId: string) {
    return this.prisma.analysisResult.findMany({
      where: { surveyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
