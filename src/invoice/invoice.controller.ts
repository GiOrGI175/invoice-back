import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUserId() userId: string,
  ) {
    return this.invoiceService.create(createInvoiceDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUserId() userId: string) {
    console.log(userId, 'userId');
    return this.invoiceService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUserId() userId: string,
  ) {
    return this.invoiceService.update(id, updateInvoiceDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.invoiceService.remove(id, userId);
  }
}
