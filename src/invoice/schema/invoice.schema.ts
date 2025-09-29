import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InvoiceStatus {
  Draft = 'draft',
  Pending = 'pending',
  Paid = 'paid',
  Overdue = 'overdue',
}

export enum InvoiceTerms {
  net1day = 1,
  net7day = 7,
  net14day = 14,
  net30day = 30,
}

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

  @Prop({ type: Number })
  total: number;
}
export const ItemSchema = SchemaFactory.createForClass(Item);

@Schema()
export class Invoice extends Document {
  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date })
  paymentDue: Date;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: Number,
    enum: Object.values(InvoiceTerms).filter((v) => typeof v === 'number'),
    required: true,
    index: true,
  })
  paymentTerms: InvoiceTerms;

  @Prop({ type: String, required: true })
  clientName: string;

  @Prop({ type: String, required: true })
  clientEmail: string;

  @Prop({
    type: String,
    enum: Object.values(InvoiceStatus),
    required: true,
    index: true,
  })
  status: InvoiceStatus;

  @Prop({ type: AddressSchema, required: true })
  senderAddress: Address;

  @Prop({ type: AddressSchema, required: true })
  clientAddress: Address;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number })
  total: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
