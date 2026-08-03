import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../../modules/users/infrastructure/users.repository";
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../constants/jwt-tokens";
import { SessionsRepository } from "../../modules/sessions/infrastructure/sessions.repository";

@Injectable()
export class RefreshTokenGuard implements CanActivate {

    constructor(
        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly JwtService: JwtService,
        private readonly UsersRepository: UsersRepository,
        private readonly SessionsRepository: SessionsRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //TODO check how to change stupid try/catch
        try {
            const req = context.switchToHttp().getRequest()

            if (!req.cookies.refreshToken) {
                throw new UnauthorizedException()
            }

            const token = req.cookies.refreshToken

            const payload = await this.JwtService.verify(token)

            const user = await this.UsersRepository.findEntityById(payload.id)

            if (!user) {
                throw new ForbiddenException()
            }

            const activeSession = await this.SessionsRepository.findSession(payload.id, payload.deviceId, Number(payload.iat))

            if (!activeSession) {
                throw new UnauthorizedException()
            }

            req.session = {
                userId: user.id,
                deviceId: payload.deviceId
            }

            return true
        }
        catch {
            throw new UnauthorizedException()
        }
    }
}