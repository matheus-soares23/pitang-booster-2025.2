import { ContaBancaria } from './conta-bancaria.entity';

export class ContaPoupanca extends ContaBancaria {
  taxaRendimento: number;
  aniversario: Date;

  constructor(numero: string, titular: string, saldo: number = 0, taxaRendimento: number = 0.005) {
    super(numero, titular, saldo);
    this.taxaRendimento = taxaRendimento;
    this.aniversario = new Date();
  }

  getTipo(): string {
    return 'Conta Poupança';
  }

  calcularRendimento(): number {
    return this.saldo * this.taxaRendimento;
  }

  aplicarRendimento(): void {
    this.saldo += this.calcularRendimento();
  }
}
