import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import type { ApiError } from '@benefit-calendar/shared-types'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const errorBody: ApiError = {
      success: false,
      error: {
        code:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Record<string, unknown>).error as string || 'UNKNOWN_ERROR',
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as Record<string, unknown>).message as string || '오류가 발생했습니다.',
      },
      meta: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    }

    response.status(status).json(errorBody)
  }
}
