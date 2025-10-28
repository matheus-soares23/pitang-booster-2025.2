export class ContaBancaria {
  id: string;
  numero: string;
  titular: string;
  saldo: number;
  tipo: 'corrente' | 'poupanca';
  dataCriacao: Date;

  constructor(
    id: string,
    numero: string,
    titular: string,
    saldo: number = 0,
    tipo: 'corrente' | 'poupanca' = 'corrente'
  ) {
    this.id = id;
    this.numero = numero;
    this.titular = titular;
    this.saldo = saldo;
    this.tipo = tipo;
    this.dataCriacao = new Date();
  }
}