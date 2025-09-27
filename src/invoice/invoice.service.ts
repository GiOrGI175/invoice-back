import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string) {
    const user = await this.userModel.findById(userId);

    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
    });

    await newInvoice.save();

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { invoices: newInvoice._id },
    });

    return newInvoice;
  }

  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
