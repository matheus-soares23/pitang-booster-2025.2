import { HttpException, HttpStatus } from '@nestjs/common';

export class ContaJaExisteException extends HttpException {
  constructor(numero: string) {
    super(`Conta com número ${numero} já existe`, HttpStatus.CONFLICT);
  }
}

export class ContaNaoEncontradaException extends HttpException {
  constructor(numero?: string) {
    const message = numero 
      ? `Conta com número ${numero} não foi encontrada`
      : 'Conta não encontrada';
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class SaldoInsuficienteException extends HttpException {
  constructor(saldoDisponivel: number, valorSaque: number) {
    super(
      `Saldo insuficiente. Disponível: R$ ${saldoDisponivel.toFixed(2)}, Tentativa de saque: R$ ${valorSaque.toFixed(2)}`,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ValorInvalidoException extends HttpException {
  constructor(valor: number) {
    super(`Valor inválido: R$ ${valor}. O valor deve ser maior que zero`, HttpStatus.BAD_REQUEST);
  }
}

export class TipoContaInvalidoException extends HttpException {
  constructor(tipoEsperado: string, tipoAtual: string) {
    super(
      `Operação inválida. Esperado: ${tipoEsperado}, Atual: ${tipoAtual}`,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class DadosInvalidosException extends HttpException {
  constructor(campo: string, motivo: string) {
    super(`Campo '${campo}' inválido: ${motivo}`, HttpStatus.BAD_REQUEST);
  }
}

export class OperacaoNaoPermitidaException extends HttpException {
  constructor(operacao: string, motivo: string) {
    super(`Operação '${operacao}' não permitida: ${motivo}`, HttpStatus.FORBIDDEN);
  }
}