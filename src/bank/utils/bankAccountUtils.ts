import { ContaBancaria } from '../entities/conta-bancaria.entity';
import { ContaCorrente } from '../entities/conta-corrente.entity';

export class BankAccountUtils {
    
  static isValorValido(valor: number): boolean {
    return valor > 0;
  }

  static isContaValida(conta: ContaBancaria | undefined): conta is ContaBancaria {
    return conta !== undefined && conta !== null;
  }

  static isContaCorrente(conta: ContaBancaria): conta is ContaCorrente {
    return conta instanceof ContaCorrente;
  }

  static getSaldoDisponivelParaSaque(conta: ContaBancaria): number {
    if (this.isContaCorrente(conta)) {
      return conta.getSaldoDisponivel();
    }
    return conta.saldo;
  }

  static podeSacar(conta: ContaBancaria, valor: number): boolean {
    if (!this.isValorValido(valor)) {
      return false;
    }
    
    const saldoDisponivel = this.getSaldoDisponivelParaSaque(conta);
    return valor <= saldoDisponivel;
  }

  static podeDepositar(conta: ContaBancaria, valor: number): boolean {
    return this.isContaValida(conta) && this.isValorValido(valor);
  }

  static gerarNumeroConta(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4);
    return `${timestamp.slice(-5)}-${random}`;
  }

  static isNumeroContaUnico(numero: string, contas: ContaBancaria[]): boolean {
    return !contas.some(conta => conta.numero === numero);
  }

  static formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
