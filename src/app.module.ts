import { Module } from '@nestjs/common';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [BankModule],
  controllers: [],
  providers: [],
})
export class AppModule {}