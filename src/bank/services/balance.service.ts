import { Injectable } from '@nestjs/common';
import { ContaBancaria } from '../entities/conta-bancaria.entity';
import { ContaCorrente } from '../entities/conta-corrente.entity';
import { BankAccountUtils } from '../utils/bankAccountUtils';

@Injectable()
export class BalanceService {

  getSaldoDisponivelParaSaque(conta: ContaBancaria): number {
    if (this.isContaCorrente(conta)) {
      return conta.getSaldoDisponivel();
    }
    return conta.saldo;
  }

  podeSacar(conta: ContaBancaria, valor: number): boolean {
    if (!BankAccountUtils.isValorValido(valor)) {
      return false;
    }
    
    const saldoDisponivel = this.getSaldoDisponivelParaSaque(conta);
    return valor <= saldoDisponivel;
  }

  podeDepositar(conta: ContaBancaria, valor: number): boolean {
    return BankAccountUtils.isContaValida(conta) && BankAccountUtils.isValorValido(valor);
  }

  realizarSaque(conta: ContaBancaria, valor: number): boolean {
    if (!this.podeSacar(conta, valor)) {
      return false;
    }
    
    conta.saldo -= valor;
    return true;
  }

  realizarDeposito(conta: ContaBancaria, valor: number): boolean {
    if (!this.podeDepositar(conta, valor)) {
      return false;
    }
    
    conta.saldo += valor;
    return true;
  }

  private isContaCorrente(conta: ContaBancaria): conta is ContaCorrente {
    return conta instanceof ContaCorrente;
  }
}