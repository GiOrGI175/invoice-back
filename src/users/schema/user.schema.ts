import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, select: false, required: true })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Invoice', default: [] })
  invoices: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
