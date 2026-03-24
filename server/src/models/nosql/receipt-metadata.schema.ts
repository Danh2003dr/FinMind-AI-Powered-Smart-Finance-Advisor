import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReceiptMetadataDocument = HydratedDocument<ReceiptMetadata>;

@Schema({ collection: 'receipt_metadata', timestamps: true })
export class ReceiptMetadata {
  @Prop({ type: String, index: true })
  userId: string;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: String })
  ocrRawText: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  parsed: Record<string, unknown>;
}

export const ReceiptMetadataSchema =
  SchemaFactory.createForClass(ReceiptMetadata);
