import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Response extends Document {
  @Prop({ required: true })
  surveyId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Array, required: true })
  answers: {
    questionId: string;
    answer: string | number;
  }[];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
