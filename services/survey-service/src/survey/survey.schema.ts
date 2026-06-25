import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SurveyDocument = Survey & Document;

export class Question {
  questionId: string;
  type: string;   // 'text' | 'rating' | 'multiple-choice'
  label: string;
  options?: string[];  // for multiple-choice
  required?: boolean;
}

@Schema({ timestamps: true })
export class Survey {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: [Object], default: [] })
  questions: Question[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  companyId: string;

  @Prop()
  createdBy: string;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);