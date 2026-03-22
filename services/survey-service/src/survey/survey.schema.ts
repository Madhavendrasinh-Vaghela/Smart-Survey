import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Survey extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Array, required: true })
  questions: {
    questionId: string;
    label: string;
    type: string;
  }[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
