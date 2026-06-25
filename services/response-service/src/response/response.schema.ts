import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = SurveyResponse & Document;

@Schema({ timestamps: true })
export class SurveyResponse {
  @Prop({ required: true, index: true })
  surveyId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [Object], default: [] })
  answers: Array<{ questionId: string; answer: string }>;
}

export const ResponseSchema = SchemaFactory.createForClass(SurveyResponse);