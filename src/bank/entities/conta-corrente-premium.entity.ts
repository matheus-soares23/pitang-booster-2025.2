import { ContaCorrente } from './conta-corrente.entity';

export class ContaCorrentePremium extends ContaCorrente {
  cashback: number;
  pontos: number;

  constructor(
    numero: string,
    titular: string,
    saldo: number = 0,
    limiteChequeEspecial: number = 2000,
    cashback: number = 0.01
  ) {
    super(numero, titular, saldo, limiteChequeEspecial);
    this.cashback = cashback;
    this.pontos = 0;
  }

  getTipo(): string {
    return 'Conta Corrente Premium';
  }

  aplicarCashback(valorCompra: number): void {
    const valorCashback = valorCompra * this.cashback;
    this.saldo += valorCashback;
    this.pontos += Math.floor(valorCompra / 10);
  }

  resgatarPontos(): number {
    const valorResgate = this.pontos * 0.01;
    this.pontos = 0;
    this.saldo += valorResgate;
    return valorResgate;
  }
}