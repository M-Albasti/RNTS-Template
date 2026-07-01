import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const body =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse;
      response.status(status).json(body);
      return;
    }

    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}
