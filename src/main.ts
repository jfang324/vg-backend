import { LoggerInterceptor } from '@common/interceptors/logger.interceptor'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalInterceptors(new LoggerInterceptor())

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: process.env.DEFAULT_VERSION || '1'
	})

	const port = parseInt(process.env.PORT || '3000')
	await app.listen(port)

	return port
}

bootstrap()
	.then((port) => {
		const mode = process.env.NODE_ENV || 'development'
		const baseUrl = process.env.BASE_URL || 'http://localhost'

		// eslint-disable-next-line no-console -- one time log on startup
		console.log(
			`VG Backend is running in ${mode} mode on ${baseUrl}:${port} the api version is ${process.env.DEFAULT_VERSION}`
		)
	})
	.catch((error) => {
		console.error(`Error starting server: ${error}`)
	})
