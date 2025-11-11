import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ErrorHandlerMiddleware implements ExceptionFilter {
  private readonly logger = new Logger('ErrorHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const errorInfo = this.getErrorInfo(exception);
    
    this.logger.error(
      `${request.method} ${request.url} - ${errorInfo.status} - ${errorInfo.message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(errorInfo.status).json({
      statusCode: errorInfo.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorInfo.message,
    });
  }

  private getErrorInfo(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }
}
