import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { CurrentHeader } from 'src/common/decorators/current-header.decorator';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUserId() userId: string,
    @CurrentHeader('x-status') xStatus?: string,
  ) {
    const status = xStatus?.toLowerCase() === 'draft' ? 'draft' : 'pending';

    return this.invoiceService.create(createInvoiceDto, userId, status);
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
