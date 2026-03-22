import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  imports: [HttpModule],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
