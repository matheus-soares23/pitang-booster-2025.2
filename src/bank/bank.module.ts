import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { BankController } from "./controllers/bank.controller";
import { BankService } from "./services/bank.service";
import { BalanceService } from "./services/balance.service";
import { LoggerMiddleware } from "./middlewares";

@Module({
  controllers: [BankController],
  providers: [BankService, BalanceService],
  exports: [BankService, BalanceService],
})
export class BankModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('banking');
  }
}
