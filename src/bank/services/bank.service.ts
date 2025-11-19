import { Injectable } from "@nestjs/common";
import { ContaBancaria } from "../entities/conta-bancaria.entity";
import { ContaCorrente } from "../entities/conta-corrente.entity";
import { ContaPoupanca } from "../entities/conta-poupanca.entity";
import { BankAccountUtils } from "../utils/bankAccountUtils";
import { BalanceService } from "./balance.service";
import { ContaCorrentePremium } from "../entities/conta-corrente-premium.entity";
import {
  ContaJaExisteException,
  ContaNaoEncontradaException,
  TipoContaInvalidoException,
  DadosInvalidosException,
  ValorInvalidoException
} from "../exceptions/bank.exceptions";

@Injectable()
export class BankService {
  private contas: ContaBancaria[] = [];

  constructor(private readonly balanceService: BalanceService) {
    this.contas.push(
      new ContaCorrente("12345-6", "João Silva", 1000.5, 1000),
      new ContaPoupanca("78901-2", "Maria Santos", 2500.75, 0.005)
    );
  }

  getContas(): ContaBancaria[] {
    return this.contas;
  }

  getContaPorNumero(numero: string): ContaBancaria {
    const conta = this.contas.find((conta) => conta.numero === numero);
    if (!conta) {
      throw new ContaNaoEncontradaException(numero);
    }
    return conta;
  }

  criarContaCorrente(
    titular: string,
    saldoInicial: number = 0,
    limiteChequeEspecial: number = 500
  ): ContaCorrente {
    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaCorrente(
      numero,
      titular,
      saldoInicial,
      limiteChequeEspecial
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  criarContaPoupanca(
    titular: string,
    saldoInicial: number = 0,
    taxaRendimento: number = 0.005
  ): ContaPoupanca {
    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaPoupanca(
      numero,
      titular,
      saldoInicial,
      taxaRendimento
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  criarContaCorrentePremium(
    titular: string,
    saldoInicial: number = 0,
    limiteChequeEspecial: number = 2000,
    cashback: number = 0.01
  ): ContaCorrentePremium {
    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaCorrentePremium(
      numero,
      titular,
      saldoInicial,
      limiteChequeEspecial,
      cashback
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  getSaldo(numero: string): number {
    const conta = this.getContaPorNumero(numero);
    return conta.saldo;
  }

  depositar(numero: string, valor: number): void {
    const conta = this.getContaPorNumero(numero);
    this.balanceService.realizarDeposito(conta, valor);
  }

  sacar(numero: string, valor: number): void {
    const conta = this.getContaPorNumero(numero);
    this.balanceService.realizarSaque(conta, valor);
  }

  atualizarContaCorrente(
    numero: string,
    dados: { titular?: string; limiteChequeEspecial?: number }
  ): void {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrente)) {
      throw new TipoContaInvalidoException('Conta Corrente', conta.constructor.name);
    }

    if (dados.titular !== undefined) {
      if (!dados.titular || dados.titular.trim() === "") {
        throw new DadosInvalidosException('titular', 'não pode ser vazio');
      }
      conta.titular = dados.titular;
    }

    if (dados.limiteChequeEspecial !== undefined) {
      if (dados.limiteChequeEspecial < 0) {
        throw new DadosInvalidosException('limiteChequeEspecial', 'deve ser maior ou igual a zero');
      }
      conta.limiteChequeEspecial = dados.limiteChequeEspecial;
    }
  }

  atualizarContaPoupanca(
    numero: string,
    dados: { titular?: string; taxaRendimento?: number }
  ): void {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaPoupanca)) {
      throw new TipoContaInvalidoException('Conta Poupança', conta.constructor.name);
    }

    if (dados.titular !== undefined) {
      if (!dados.titular || dados.titular.trim() === "") {
        throw new DadosInvalidosException('titular', 'não pode ser vazio');
      }
      conta.titular = dados.titular;
    }

    if (dados.taxaRendimento !== undefined) {
      if (dados.taxaRendimento < 0) {
        throw new DadosInvalidosException('taxaRendimento', 'deve ser maior ou igual a zero');
      }
      conta.taxaRendimento = dados.taxaRendimento;
    }
  }

  atualizarContaCorrentePremium(
    numero: string,
    dados: {
      titular?: string;
      limiteChequeEspecial?: number;
      cashback?: number;
    }
  ): void {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrentePremium)) {
      throw new TipoContaInvalidoException('Conta Corrente Premium', conta.constructor.name);
    }

    if (dados.titular !== undefined) {
      if (!dados.titular || dados.titular.trim() === "") {
        throw new DadosInvalidosException('titular', 'não pode ser vazio');
      }
      conta.titular = dados.titular;
    }

    if (dados.limiteChequeEspecial !== undefined) {
      if (dados.limiteChequeEspecial < 0) {
        throw new DadosInvalidosException('limiteChequeEspecial', 'deve ser maior ou igual a zero');
      }
      conta.limiteChequeEspecial = dados.limiteChequeEspecial;
    }

    if (dados.cashback !== undefined) {
      if (dados.cashback < 0) {
        throw new DadosInvalidosException('cashback', 'deve ser maior ou igual a zero');
      }
      conta.cashback = dados.cashback;
    }
  }

  excluirConta(numero: string): void {
    const index = this.contas.findIndex((conta) => conta.numero === numero);
    if (index === -1) {
      throw new ContaNaoEncontradaException(numero);
    }
    this.contas.splice(index, 1);
  }

  aplicarCashback(numero: string, valorCompra: number): void {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrentePremium)) {
      throw new TipoContaInvalidoException('Conta Corrente Premium', conta.constructor.name);
    }
    if (valorCompra <= 0) {
      throw new ValorInvalidoException(valorCompra);
    }
    conta.aplicarCashback(valorCompra);
  }

  resgatarPontos(numero: string): number {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrentePremium)) {
      throw new TipoContaInvalidoException('Conta Corrente Premium', conta.constructor.name);
    }
    return conta.resgatarPontos();
  }

  aplicarRendimento(numero: string): void {
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaPoupanca)) {
      throw new TipoContaInvalidoException('Conta Poupança', conta.constructor.name);
    }
    conta.aplicarRendimento();
  }
}
