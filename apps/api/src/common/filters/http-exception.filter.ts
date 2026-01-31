import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const errorBody = {
      success: false,
      error: {
        code:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Record<string, unknown>).error || 'UNKNOWN_ERROR',
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Record<string, unknown>).message || '오류가 발생했습니다.',
      },
      meta: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    }

    response.status(status).json(errorBody)
  }
}
