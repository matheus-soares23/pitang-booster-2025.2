import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: Array<{ field: string; message: string }>) {
    super(
      {
        message: 'Erro de validação dos dados fornecidos',
        error: 'VALIDATION_ERROR',
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

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
      HttpStatus.PAYMENT_REQUIRED
    );
  }
}

export class ValorInvalidoException extends HttpException {
  constructor(valor: number) {
    super(`Valor inválido: R$ ${valor}. O valor deve ser maior que zero`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class TipoContaInvalidoException extends HttpException {
  constructor(tipoEsperado: string, tipoAtual: string) {
    super(
      `Operação inválida. Esperado: ${tipoEsperado}, Atual: ${tipoAtual}`,
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

export class DadosInvalidosException extends HttpException {
  constructor(campo: string, motivo: string) {
    super(`Campo '${campo}' inválido: ${motivo}`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class OperacaoNaoPermitidaException extends HttpException {
  constructor(operacao: string, motivo: string) {
    super(`Operação '${operacao}' não permitida: ${motivo}`, HttpStatus.FORBIDDEN);
  }
}