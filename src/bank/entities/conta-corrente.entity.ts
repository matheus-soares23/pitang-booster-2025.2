import { ContaBancaria } from './conta-bancaria.entity';

export class ContaCorrente extends ContaBancaria {
  limiteChequeEspecial: number;

  constructor(numero: string, titular: string, saldo: number = 0, limiteChequeEspecial: number = 500) {
    super(numero, titular, saldo);
    this.limiteChequeEspecial = limiteChequeEspecial;
  }

  getTipo(): string {
    return 'Conta Corrente';
  }

  getSaldoDisponivel(): number {
    return this.saldo + this.limiteChequeEspecial;
  }
}
