import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AiLogDocument = HydratedDocument<AiLog>;

@Schema({
  collection: 'ai_logs',
  timestamps: { createdAt: true, updatedAt: false },
})
export class AiLog {
  @Prop({ type: String, index: true })
  userId: string;

  @Prop({ type: String })
  model: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  messages: unknown[];

  @Prop({ type: Number })
  promptTokens?: number;

  @Prop({ type: Number })
  completionTokens?: number;
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog);
