import { Injectable } from '@nestjs/common';
import { ContaBancaria } from '../entities/conta-bancaria.entity';
import { ContaCorrente } from '../entities/conta-corrente.entity';
import { ContaPoupanca } from '../entities/conta-poupanca.entity';
import { BankAccountUtils } from '../utils/bankAccountUtils';

@Injectable()
export class BankService {
  private contas: ContaBancaria[] = [];

  constructor() {
    this.contas.push(
      new ContaCorrente('12345-6', 'João Silva', 1000.50, 1000),
      new ContaPoupanca('78901-2', 'Maria Santos', 2500.75, 0.005)
    );
  }

  getContas(): ContaBancaria[] {
    return this.contas;
  }

  getContaPorNumero(numero: string): ContaBancaria | undefined {
    return this.contas.find(conta => conta.numero === numero);
  }

  criarContaCorrente(titular: string, saldoInicial: number = 0, limiteChequeEspecial: number = 500): ContaCorrente {
    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new Error('Número de conta já existe');
    }
    
    const novaConta = new ContaCorrente(numero, titular, saldoInicial, limiteChequeEspecial);
    this.contas.push(novaConta);
    return novaConta;
  }

  criarContaPoupanca(titular: string, saldoInicial: number = 0, taxaRendimento: number = 0.005): ContaPoupanca {
    const numero = BankAccountUtils.gerarNumeroConta();
    if (!BankAccountUtils.isNumeroContaUnico(numero, this.contas)) {
      throw new Error('Número de conta já existe');
    }
    
    const novaConta = new ContaPoupanca(numero, titular, saldoInicial, taxaRendimento);
    this.contas.push(novaConta);
    return novaConta;
  }

  getSaldo(numero: string): number | null {
    const conta = this.getContaPorNumero(numero);
    return conta ? conta.saldo : null;
  }

  depositar(numero: string, valor: number): boolean {
    const conta = this.getContaPorNumero(numero);
    
    if (!BankAccountUtils.podeDepositar(conta, valor)) {
      return false;
    }
    
    conta.saldo += valor;
    return true;
  }

  sacar(numero: string, valor: number): boolean {
    const conta = this.getContaPorNumero(numero);
    
    if (!BankAccountUtils.isContaValida(conta) || !BankAccountUtils.podeSacar(conta, valor)) {
      return false;
    }
    
    conta.saldo -= valor;
    return true;
  }
}