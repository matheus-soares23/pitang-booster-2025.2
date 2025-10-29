export abstract class ContaBancaria {
  numero: string;
  saldo: number;
  titular: string;

  constructor(numero: string, titular: string, saldo: number = 0) {
    this.numero = numero;
    this.titular = titular;
    this.saldo = saldo;
  }

  abstract getTipo(): string;
}