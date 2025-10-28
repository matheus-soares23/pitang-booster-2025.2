import { Injectable } from '@nestjs/common';
import { ContaBancaria } from '../entities/conta-bancaria.entity';

@Injectable()
export class BankService {
  private contas: ContaBancaria[] = [];

  constructor() {
    this.contas.push(
      new ContaBancaria(
        this.generateId(),
        '12345-6',
        'João Silva',
        1000.50,
        'corrente'
      ),
      new ContaBancaria(
        this.generateId(),
        '78901-2',
        'Maria Santos',
        2500.75,
        'poupanca'
      )
    );
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  listarContas(): ContaBancaria[] {
    return this.contas;
  }

  buscarContaPorId(id: string): ContaBancaria | undefined {
    return this.contas.find(conta => conta.id === id);
  }

  criarConta(numero: string, titular: string, tipo: 'corrente' | 'poupanca' = 'corrente'): ContaBancaria {
    const novaConta = new ContaBancaria(
      this.generateId(),
      numero,
      titular,
      0,
      tipo
    );
    this.contas.push(novaConta);
    return novaConta;
  }

  consultarSaldo(id: string): number | null {
    const conta = this.buscarContaPorId(id);
    return conta ? conta.saldo : null;
  }
}