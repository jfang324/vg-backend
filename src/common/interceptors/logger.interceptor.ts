import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

/**
 * Logs basic information about the request and response.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req: Request = context.switchToHttp().getRequest()
		const method: string = req.method
		const url: string = req.originalUrl

		const res: Response = context.switchToHttp().getResponse()
		const start: number = Date.now()

		return next.handle().pipe(
			tap({
				complete: () => {
					const end: number = Date.now()
					const duration = end - start

					// eslint-disable-next-line no-console -- placeholder for sending logging request
					console.log(`${method} ${url} ${res.statusCode} ${duration}ms`)
				}
			})
		)
	}
}
