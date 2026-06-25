import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { SurveyResponse, ResponseSchema } from './response.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SurveyResponse.name, schema: ResponseSchema }])],
  providers: [ResponseService],
  controllers: [ResponseController],
})
export class ResponseModule {}