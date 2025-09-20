import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HenrikDevModule } from './integrations/henrik-dev/henrik-dev.module'
import { HealthModule } from './modules/health/health.module'
import { LoggingModule } from './modules/logging/logging.module'
import { PlayersModule } from './modules/players/players.module'

@Module({
	imports: [ConfigModule.forRoot(), HenrikDevModule, PlayersModule, HealthModule, LoggingModule]
})
export class AppModule {}
