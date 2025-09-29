import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { Model, Types } from 'mongoose';
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdAt = new Date(createInvoiceDto.createdAt);

    const itemsWithTotals = (createInvoiceDto.items || []).map((it) => {
      const qty = Number(it.quantity);
      const price = Number(it.price);
      return {
        ...it,
        total: qty * price,
      };
    });

    let invoiceTotal = 0;

    itemsWithTotals.forEach((item) => {
      invoiceTotal += item.total || 0;
    });

    const paymentTermsDays = Number(createInvoiceDto.paymentTerms);
    const paymentDue = new Date(
      createdAt.getTime() + paymentTermsDays * 24 * 60 * 60 * 1000,
    );

    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      createdAt,
      paymentDue,
      items: itemsWithTotals,
      total: invoiceTotal,
      user: user._id,
    });

    await newInvoice.save();

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { invoices: newInvoice._id },
    });

    return newInvoice;
  }

  async findAll(userId: string) {
    return this.invoiceModel.find({ user: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceModel.findById(id);

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    const user = await this.userModel.findById(userId);
    if (
      !user ||
      !user.invoices?.some(
        (invId) => invId.toString() === invoice._id.toString(),
      )
    ) {
      throw new ForbiddenException(
        `You don't have access to update this invoice`,
      );
    }

    let itemsWithTotals = invoice.items;
    let invoiceTotal = invoice.total ?? 0;

    if (updateInvoiceDto.items) {
      itemsWithTotals = updateInvoiceDto.items.map((it) => {
        const qty = Number(it.quantity);
        const price = Number(it.price);
        return { ...it, total: qty * price };
      });

      invoiceTotal = 0;
      for (const it of itemsWithTotals) {
        invoiceTotal += it.total || 0;
      }
    }

    const createdAt = updateInvoiceDto.createdAt
      ? new Date(updateInvoiceDto.createdAt)
      : invoice.createdAt;

    const paymentTerms = updateInvoiceDto.paymentTerms ?? invoice.paymentTerms;

    let paymentDue = invoice.paymentDue;
    if (updateInvoiceDto.createdAt || updateInvoiceDto.paymentTerms) {
      paymentDue = new Date(
        createdAt.getTime() + Number(paymentTerms) * 24 * 60 * 60 * 1000,
      );
    }

    const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(
      id,
      {
        ...updateInvoiceDto,
        createdAt,
        paymentDue,
        items: itemsWithTotals,
        total: invoiceTotal,
      },
      { new: true, runValidators: true },
    );

    return updatedInvoice;
  }

  async remove(id: string, userId: string) {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    await this.invoiceModel.findByIdAndDelete(id);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { invoices: invoice._id },
    });

    return { message: `Invoice ${id} has been removed successfully` };
  }
}
