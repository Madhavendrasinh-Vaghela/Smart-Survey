import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Response extends Document {
  @Prop() surveyId: string;
  @Prop() userId: string;
  @Prop({ type: Array }) answers: { questionId: string; answer: string }[];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
