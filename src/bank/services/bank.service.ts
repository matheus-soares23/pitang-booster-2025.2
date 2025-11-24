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
  ValorInvalidoException,
  ValidationException
} from "../exceptions/bank.exceptions";
import { ZodError } from "zod";
import {
  criarContaCorrenteSchema,
  criarContaPoupancaSchema,
  criarContaCorrentePremiumSchema,
  depositoSchema,
  saqueSchema,
  atualizarContaCorrenteSchema,
  atualizarContaPoupancaSchema,
  atualizarContaCorrentePremiumSchema,
} from "../dto/validation.schemas";

@Injectable()
export class BankService {
  private contas: ContaBancaria[] = [];

  constructor(private readonly balanceService: BalanceService) {
    this.contas.push(
      new ContaCorrente("12345-6", "João Silva", 1000.5, 1000),
      new ContaPoupanca("78901-2", "Maria Santos", 2500.75, 0.005)
    );
  }

  private validarDados(schema: any, dados: unknown): any {
    try {
      return schema.parse(dados);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationException(formattedErrors);
      }
      throw new ValidationException([{ field: 'unknown', message: 'Erro de validação' }]);
    }
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
    const dados = this.validarDados(criarContaCorrenteSchema, {
      titular,
      saldoInicial,
      limiteChequeEspecial,
    });

    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaCorrente(
      numero,
      dados.titular,
      dados.saldoInicial,
      dados.limiteChequeEspecial
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  criarContaPoupanca(
    titular: string,
    saldoInicial: number = 0,
    taxaRendimento: number = 0.005
  ): ContaPoupanca {
    const dados = this.validarDados(criarContaPoupancaSchema, {
      titular,
      saldoInicial,
      taxaRendimento,
    });

    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaPoupanca(
      numero,
      dados.titular,
      dados.saldoInicial,
      dados.taxaRendimento
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
    const dados = this.validarDados(criarContaCorrentePremiumSchema, {
      titular,
      saldoInicial,
      limiteChequeEspecial,
      cashback,
    });

    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new ContaJaExisteException(numero);
    }

    const novaConta = new ContaCorrentePremium(
      numero,
      dados.titular,
      dados.saldoInicial,
      dados.limiteChequeEspecial,
      dados.cashback
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  getSaldo(numero: string): number {
    const conta = this.getContaPorNumero(numero);
    return conta.saldo;
  }

  depositar(numero: string, valor: number): void {
    const dados = this.validarDados(depositoSchema, { valor });
    const conta = this.getContaPorNumero(numero);
    this.balanceService.realizarDeposito(conta, dados.valor);
  }

  sacar(numero: string, valor: number): void {
    const dados = this.validarDados(saqueSchema, { valor });
    const conta = this.getContaPorNumero(numero);
    this.balanceService.realizarSaque(conta, dados.valor);
  }

  atualizarContaCorrente(
    numero: string,
    dados: { titular?: string; limiteChequeEspecial?: number }
  ): void {
    const dadosValidados = this.validarDados(atualizarContaCorrenteSchema, dados);
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrente)) {
      throw new TipoContaInvalidoException('Conta Corrente', conta.constructor.name);
    }

    if (dadosValidados.titular !== undefined) {
      conta.titular = dadosValidados.titular;
    }

    if (dadosValidados.limiteChequeEspecial !== undefined) {
      conta.limiteChequeEspecial = dadosValidados.limiteChequeEspecial;
    }
  }

  atualizarContaPoupanca(
    numero: string,
    dados: { titular?: string; taxaRendimento?: number }
  ): void {
    const dadosValidados = this.validarDados(atualizarContaPoupancaSchema, dados);
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaPoupanca)) {
      throw new TipoContaInvalidoException('Conta Poupança', conta.constructor.name);
    }

    if (dadosValidados.titular !== undefined) {
      conta.titular = dadosValidados.titular;
    }

    if (dadosValidados.taxaRendimento !== undefined) {
      conta.taxaRendimento = dadosValidados.taxaRendimento;
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
    const dadosValidados = this.validarDados(atualizarContaCorrentePremiumSchema, dados);
    const conta = this.getContaPorNumero(numero);
    if (!(conta instanceof ContaCorrentePremium)) {
      throw new TipoContaInvalidoException('Conta Corrente Premium', conta.constructor.name);
    }

    if (dadosValidados.titular !== undefined) {
      conta.titular = dadosValidados.titular;
    }

    if (dadosValidados.limiteChequeEspecial !== undefined) {
      conta.limiteChequeEspecial = dadosValidados.limiteChequeEspecial;
    }

    if (dadosValidados.cashback !== undefined) {
      conta.cashback = dadosValidados.cashback;
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
