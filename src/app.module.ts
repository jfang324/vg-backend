import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HenrikDevModule } from './integrations/henrik-dev/henrik-dev.module'

@Module({
	imports: [ConfigModule.forRoot(), HenrikDevModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
