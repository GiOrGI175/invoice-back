import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Address {
  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  postCode: string;

  @Prop({ type: String, required: true })
  country: string;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ _id: false })
export class Item {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}
export const ItemSchema = SchemaFactory.createForClass(Item);

@Schema()
export class Invoice extends Document {
  @Prop({ type: String, required: true })
  createdAt: string;

  @Prop({ type: String, required: true })
  paymentDue: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  paymentTerms: number;

  @Prop({ type: String, required: true })
  clientName: string;

  @Prop({ type: String, required: true })
  clientEmail: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: AddressSchema, required: true })
  senderAddress: Address;

  @Prop({ type: AddressSchema, required: true })
  clientAddress: Address;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number, required: true })
  total: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
