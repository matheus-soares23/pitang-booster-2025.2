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
        "Erro ao realizar saque. Saldo insuficiente",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Saque realizado com sucesso" };
  }

  @Put("contas/corrente/:numero")
  atualizarContaCorrente(
    @Param("numero") numero: string,
    @Body() body: { titular?: string; limiteChequeEspecial?: number }
  ) {
    const sucesso = this.bankService.atualizarContaCorrente(numero, body);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao atualizar conta. Conta não encontrada, não é corrente ou dados inválidos",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Conta corrente atualizada com sucesso" };
  }

  @Put("contas/poupanca/:numero")
  atualizarContaPoupanca(
    @Param("numero") numero: string,
    @Body() body: { titular?: string; taxaRendimento?: number }
  ) {
    const sucesso = this.bankService.atualizarContaPoupanca(numero, body);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao atualizar conta. Conta não encontrada, não é poupança ou dados inválidos",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Conta poupança atualizada com sucesso" };
  }

  @Put("contas/corrente-premium/:numero")
  atualizarContaCorrentePremium(
    @Param("numero") numero: string,
    @Body()
    body: {
      titular?: string;
      limiteChequeEspecial?: number;
      cashback?: number;
    }
  ) {
    const sucesso = this.bankService.atualizarContaCorrentePremium(
      numero,
      body
    );
    if (!sucesso) {
      throw new HttpException(
        "Erro ao atualizar conta. Cconta não encontrada, não é premium ou dados inválidos",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Conta corrente premium atualizada com sucesso" };
  }

  @Delete("contas/:numero")
  excluirConta(@Param("numero") numero: string) {
    const sucesso = this.bankService.excluirConta(numero);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao excluir conta. Conta não encontrada",
        HttpStatus.NOT_FOUND
      );
    }
    return { message: "Conta excluída com sucesso" };
  }

  @Post("contas/:numero/cashback")
  aplicarCashback(
    @Param("numero") numero: string,
    @Body() body: { valorCompra: number }
  ) {
    const sucesso = this.bankService.aplicarCashback(numero, body.valorCompra);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao aplicar cashback. Conta não é premium ou valor inválido",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Cashback aplicado com sucesso" };
  }

  @Post("contas/:numero/resgatar-pontos")
  resgatarPontos(@Param("numero") numero: string) {
    const valorResgate = this.bankService.resgatarPontos(numero);
    if (valorResgate === null) {
      throw new HttpException(
        "Erro ao resgatar pontos. Conta não é premium",
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      message: "Pontos resgatados com sucesso",
      valorResgate: valorResgate,
    };
  }

  @Post("contas/:numero/aplicar-rendimento")
  aplicarRendimento(@Param("numero") numero: string) {
    const sucesso = this.bankService.aplicarRendimento(numero);
    if (!sucesso) {
      throw new HttpException(
        "Erro ao aplicar rendimento. Conta não é poupança",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Rendimento aplicado com sucesso" };
  }
}
