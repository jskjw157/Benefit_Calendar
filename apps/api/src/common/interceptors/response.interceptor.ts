import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import type { ApiSuccess } from '@benefit-calendar/shared-types'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccess<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true as const,
        data,
        meta: {
          requestId: uuidv4(),
          timestamp: new Date().toISOString(),
        },
      }))
    )
  }
}
