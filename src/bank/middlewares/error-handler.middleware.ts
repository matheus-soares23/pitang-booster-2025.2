import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ContaJaExisteException,
  ContaNaoEncontradaException,
  SaldoInsuficienteException,
  ValorInvalidoException,
  TipoContaInvalidoException,
  DadosInvalidosException,
  OperacaoNaoPermitidaException,
  ValidationException,
} from "../exceptions/bank.exceptions";

@Catch()
export class ErrorHandlerMiddleware implements ExceptionFilter {
  private readonly logger = new Logger("ErrorHandler");

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorInfo = this.getErrorInfo(exception);

    this.logError(request, errorInfo, exception);

    response.status(errorInfo.status).json({
      statusCode: errorInfo.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorInfo.message,
      error: errorInfo.error,
      details: errorInfo.details,
    });
  }

  private getErrorInfo(exception: unknown): {
    status: number;
    message: string;
    error: string;
    details?: any;
  } {
    if (exception instanceof ValidationException) {
      const response = exception.getResponse() as any;
      return {
        status: exception.getStatus(),
        message: response.message,
        error: response.error,
        details: response.errors,
      };
    }

    if (exception instanceof ContaJaExisteException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "CONTA_JA_EXISTE",
        details: "Uma conta com este número já está registrada no sistema",
      };
    }

    if (exception instanceof ContaNaoEncontradaException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "CONTA_NAO_ENCONTRADA",
        details: "A conta especificada não foi localizada no sistema",
      };
    }

    if (exception instanceof SaldoInsuficienteException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "SALDO_INSUFICIENTE",
        details: "O saldo disponível é insuficiente para realizar a operação",
      };
    }

    if (exception instanceof ValorInvalidoException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "VALOR_INVALIDO",
        details: "O valor informado deve ser um número positivo maior que zero",
      };
    }

    if (exception instanceof TipoContaInvalidoException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "TIPO_CONTA_INVALIDO",
        details:
          "A operação solicitada não é permitida para este tipo de conta",
      };
    }

    if (exception instanceof DadosInvalidosException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "DADOS_INVALIDOS",
        details: "Os dados fornecidos não atendem aos critérios de validação",
      };
    }

    if (exception instanceof OperacaoNaoPermitidaException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "OPERACAO_NAO_PERMITIDA",
        details: "A operação solicitada não pode ser executada",
      };
    }

    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        error: "HTTP_EXCEPTION",
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: "INTERNAL_ERROR",
        details: "Algo deu errado",
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Erro interno do servidor",
      error: "UNKNOWN_ERROR",
      details: "Ocorreu um erro inesperado",
    };
  }

  private logError(request: Request, errorInfo: any, exception: unknown) {
    const logMessage = `${request.method} ${request.url} - ${errorInfo.status} - ${errorInfo.error} - ${errorInfo.message}`;

    if (errorInfo.status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : undefined
      );
    } else {
      this.logger.warn(logMessage);
    }
  }
}
