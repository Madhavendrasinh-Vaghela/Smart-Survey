import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SurveyModule } from './survey/survey.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    AuthModule,
    SurveyModule,
    AnalysisModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
