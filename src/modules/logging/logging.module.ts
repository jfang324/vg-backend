import { Global, Logger, Module } from '@nestjs/common'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { LoggingService } from './logging.service'

@Global()
@Module({
	providers: [LoggingService, Logger, LoggingInterceptor],
	exports: [LoggingService, LoggingInterceptor]
})
export class LoggingModule {}
