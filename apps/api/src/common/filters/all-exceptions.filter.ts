import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import type { ApiError } from '@benefit-calendar/shared-types'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code = 'INTERNAL_SERVER_ERROR'
    let message = '서버 오류가 발생했습니다.'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'string') {
        code = exceptionResponse
        message = exceptionResponse
      } else {
        const res = exceptionResponse as Record<string, unknown>
        code = (res.error as string) || 'HTTP_ERROR'
        message = (Array.isArray(res.message) ? (res.message as string[]).join(', ') : res.message as string) || exception.message
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack)
      // Prisma known error codes start with 'P'
      const prismaError = exception as Error & { code?: string }
      if (prismaError.code === 'P2002') {
        status = HttpStatus.CONFLICT
        code = 'DUPLICATE_ENTRY'
        message = '이미 존재하는 데이터입니다.'
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND
        code = 'NOT_FOUND'
        message = '요청한 데이터를 찾을 수 없습니다.'
      }
    } else {
      this.logger.error('Unhandled exception (non-Error):', exception)
    }

    const errorBody: ApiError = {
      success: false,
      error: { code, message },
      meta: {
        requestId: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    }

    response.status(status).json(errorBody)
  }
}
