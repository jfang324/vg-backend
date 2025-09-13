import { CanActivate, Injectable } from '@nestjs/common'

@Injectable()
export class DevGuard implements CanActivate {
	canActivate(): boolean {
		const mode = process.env.NODE_ENV

        return mode === 'development'
	}
}