import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from "@nestjs/common";
import { BankService } from "../services/bank.service";
import { ContaBancaria } from "../entities/conta-bancaria.entity";

@Controller("banking")
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get("contas")
  getContas(): ContaBancaria[] {
    return this.bankService.getContas();
  }

  @Get("contas/:numero")
  getContaPorNumero(@Param("numero") numero: string): ContaBancaria {
    return this.bankService.getContaPorNumero(numero);
  }

  @Get("contas/:numero/saldo")
  getSaldo(@Param("numero") numero: string): { saldo: number } {
    const saldo = this.bankService.getSaldo(numero);
    return { saldo };
  }

  @Post("contas/corrente")
  criarContaCorrente(
    @Body()
    body: {
      titular: string;
      saldoInicial?: number;
      limiteChequeEspecial?: number;
    }
  ) {
    return this.bankService.criarContaCorrente(
      body.titular,
      body.saldoInicial,
      body.limiteChequeEspecial
    );
  }

  @Post("contas/poupanca")
  criarContaPoupanca(
    @Body()
    body: {
      titular: string;
      saldoInicial?: number;
      taxaRendimento?: number;
    }
  ) {
    return this.bankService.criarContaPoupanca(
      body.titular,
      body.saldoInicial,
      body.taxaRendimento
    );
  }

  @Post("contas/corrente-premium")
  criarContaCorrentePremium(
    @Body()
    body: {
      titular: string;
      saldoInicial?: number;
      limiteChequeEspecial?: number;
      cashback?: number;
    }
  ) {
    return this.bankService.criarContaCorrentePremium(
      body.titular,
      body.saldoInicial,
      body.limiteChequeEspecial,
      body.cashback
    );
  }

  @Post("contas/:numero/deposito")
  depositar(@Param("numero") numero: string, @Body() body: { valor: number }) {
    this.bankService.depositar(numero, body.valor);
    return { message: "Depósito realizado com sucesso" };
  }

  @Post("contas/:numero/saque")
  sacar(@Param("numero") numero: string, @Body() body: { valor: number }) {
    this.bankService.sacar(numero, body.valor);
    return { message: "Saque realizado com sucesso" };
  }

  @Put("contas/:numero/corrente")
  atualizarContaCorrente(
    @Param("numero") numero: string,
    @Body() body: { titular?: string; limiteChequeEspecial?: number }
  ) {
    this.bankService.atualizarContaCorrente(numero, body);
    return { message: "Conta corrente atualizada com sucesso" };
  }

  @Put("contas/:numero/poupanca")
  atualizarContaPoupanca(
    @Param("numero") numero: string,
    @Body() body: { titular?: string; taxaRendimento?: number }
  ) {
    this.bankService.atualizarContaPoupanca(numero, body);
    return { message: "Conta poupança atualizada com sucesso" };
  }

  @Put("contas/:numero/corrente-premium")
  atualizarContaCorrentePremium(
    @Param("numero") numero: string,
    @Body()
    body: {
      titular?: string;
      limiteChequeEspecial?: number;
      cashback?: number;
    }
  ) {
    this.bankService.atualizarContaCorrentePremium(numero, body);
    return { message: "Conta corrente premium atualizada com sucesso" };
  }

  @Delete("contas/:numero")
  excluirConta(@Param("numero") numero: string) {
    this.bankService.excluirConta(numero);
    return { message: "Conta excluída com sucesso" };
  }

  @Post("contas/:numero/cashback")
  aplicarCashback(
    @Param("numero") numero: string,
    @Body() body: { valorCompra: number }
  ) {
    this.bankService.aplicarCashback(numero, body.valorCompra);
    return { message: "Cashback aplicado com sucesso" };
  }

  @Post("contas/:numero/resgatar-pontos")
  resgatarPontos(@Param("numero") numero: string) {
    const valorResgate = this.bankService.resgatarPontos(numero);
    return {
      message: "Pontos resgatados com sucesso",
      valorResgate: valorResgate,
    };
  }

  @Post("contas/:numero/aplicar-rendimento")
  aplicarRendimento(@Param("numero") numero: string) {
    this.bankService.aplicarRendimento(numero);
    return { message: "Rendimento aplicado com sucesso" };
  }
}
