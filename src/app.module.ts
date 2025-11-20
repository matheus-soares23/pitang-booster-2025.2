import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30,
      max: 100,
      isGlobal: true,
    }),
    BankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}