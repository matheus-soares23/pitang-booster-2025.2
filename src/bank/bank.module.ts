import { Module } from "@nestjs/common";
import { BankController } from "./controllers/bank.controller";
import { BankService } from "./services/bank.service";
import { BalanceService } from "./services/balance.service";

@Module({
  controllers: [BankController],
  providers: [BankService, BalanceService],
  exports: [BankService, BalanceService],
})
export class BankModule {}
