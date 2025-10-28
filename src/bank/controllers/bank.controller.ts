import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { ContaBancaria } from '../entities/conta-bancaria.entity';

@Controller('banking')
export class BankController {
  
  constructor(
    private readonly bankService: BankService
  ) {}

  @Get('contas')
  listarContas(): ContaBancaria[] {
    return this.bankService.listarContas();
  }

  @Get('contas/:id')
  buscarContaPorId(@Param('id') id: string): ContaBancaria {
    const conta = this.bankService.buscarContaPorId(id);
    if (!conta) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }
    return conta;
  }

  @Get('contas/:id/saldo')
  consultarSaldo(@Param('id') id: string): { saldo: number } {
    const saldo = this.bankService.consultarSaldo(id);
    if (saldo === null) {
      throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
    }
    return { saldo };
  }
}