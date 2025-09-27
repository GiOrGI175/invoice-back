import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './schema/invoice.schema';
import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invoice', schema: InvoiceSchema },
      { name: 'User', schema: UserSchema },
    ]),
    UsersModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
