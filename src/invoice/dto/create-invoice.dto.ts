import {
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsISO8601,
  IsIn,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsISO8601()
  createdAt: string;

  @IsString()
  @IsISO8601()
  paymentDue: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  paymentTerms: number;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  clientEmail: string;

  @IsString()
  @IsIn(['draft', 'pending', 'paid'])
  status: string;

  @ValidateNested()
  @Type(() => AddressDto)
  senderAddress: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  clientAddress: AddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNumber()
  @Min(0)
  total: number;
}
