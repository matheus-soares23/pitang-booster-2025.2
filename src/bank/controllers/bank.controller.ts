import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
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
    const conta = this.bankService.getContaPorNumero(numero);
    if (!conta) {
      throw new HttpException("Conta não encontrada", HttpStatus.NOT_FOUND);
    }
    return conta;
  }

  @Get("contas/:numero/saldo")
  getSaldo(@Param("numero") numero: string): { saldo: number } {
    const saldo = this.bankService.getSaldo(numero);
    if (saldo === null) {
      throw new HttpException("Conta não encontrada", HttpStatus.NOT_FOUND);
    }
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
    const sucesso = this.bankService.depositar(numero, body.valor);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao realizar depósito",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Depósito realizado com sucesso" };
  }

  @Post("contas/:numero/saque")
  sacar(@Param("numero") numero: string, @Body() body: { valor: number }) {
    const sucesso = this.bankService.sacar(numero, body.valor);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao realizar saque - saldo insuficiente",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Saque realizado com sucesso" };
  }
}
