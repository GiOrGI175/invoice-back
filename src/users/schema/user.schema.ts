import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class User {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, select: false, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
