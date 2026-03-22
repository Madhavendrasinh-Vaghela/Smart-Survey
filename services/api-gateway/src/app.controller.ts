import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@Req() req: any) {
    return {
      message: 'You accessed a protected route',
      user: req.user,
    };
  }
constructor(private readonly http: HttpService) {}
  @Get('analysis')
  async getAnalysis(@Query('surveyId') surveyId: string) {
    const res = await firstValueFrom(
      this.http.get(`http://localhost:3005/analysis`, {
        params: { surveyId },
      }),
    );
    return res.data;
  }
}
