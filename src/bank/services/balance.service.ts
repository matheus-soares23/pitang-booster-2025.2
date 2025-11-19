import { Injectable } from '@nestjs/common';
import { ContaBancaria } from '../entities/conta-bancaria.entity';
import { ContaCorrente } from '../entities/conta-corrente.entity';
import { BankAccountUtils } from '../utils/bankAccountUtils';
import { 
  ValorInvalidoException, 
  SaldoInsuficienteException 
} from '../exceptions/bank.exceptions';

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

  realizarSaque(conta: ContaBancaria, valor: number): void {
    if (!BankAccountUtils.isValorValido(valor)) {
      throw new ValorInvalidoException(valor);
    }
    
    const saldoDisponivel = this.getSaldoDisponivelParaSaque(conta);
    if (valor > saldoDisponivel) {
      throw new SaldoInsuficienteException(saldoDisponivel, valor);
    }
    
    conta.saldo -= valor;
  }

  realizarDeposito(conta: ContaBancaria, valor: number): void {
    if (!BankAccountUtils.isValorValido(valor)) {
      throw new ValorInvalidoException(valor);
    }
    
    conta.saldo += valor;
  }

  private isContaCorrente(conta: ContaBancaria): conta is ContaCorrente {
    return conta instanceof ContaCorrente;
  }
}