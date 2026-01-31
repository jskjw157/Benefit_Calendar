import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        meta: {
          requestId: uuidv4(),
          timestamp: new Date().toISOString(),
        },
      }))
    )
  }
}
