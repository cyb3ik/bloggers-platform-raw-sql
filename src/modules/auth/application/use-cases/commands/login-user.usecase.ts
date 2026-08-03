import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginInputDto } from "../../../api/dto/login.input-dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../auth.service";
import { Request, Response } from "express";
import { Inject } from "@nestjs/common";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../../../../../core/constants/jwt-tokens";
import { randomUUID } from "crypto";
import { Session } from "../../../../sessions/domain/session-domain.entity";
import { SessionsRepository } from "../../../../sessions/infrastructure/sessions.repository";


export class LoginUserCommand {
    constructor(
        public readonly dto: LoginInputDto,
        public readonly req: Request,
        public readonly res: Response
    ) { }
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
    implements ICommandHandler<LoginUserCommand> {
    constructor(
        @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly AccessTokenService: JwtService,

        @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
        private readonly RefreshTokenService: JwtService,

        private readonly SessionsRepository: SessionsRepository,

        private readonly AuthService: AuthService,
    ) { }

    async execute({ dto, req, res }: LoginUserCommand): Promise<{ accessToken: string }> {

        const user = await this.AuthService.checkCredentials(dto)

        const userId = user.id
        const deviceId = randomUUID().toString()

        const accessToken = this.AccessTokenService.sign({ id: userId })

        const refreshToken = this.RefreshTokenService.sign({ id: userId, deviceId: deviceId })

        const refreshTokenPayload = await this.RefreshTokenService.verify(refreshToken)

        const sessionDomainDto = {
            id: randomUUID().toString(),
            ip: req.ip!,
            title: req.headers["user-agent"] || "Device",
            lastActiveDate: refreshTokenPayload.iat!.toString(),
            deviceId: deviceId,
            userId: userId,
            exp: refreshTokenPayload.exp!.toString()
        }

        const session = new Session(sessionDomainDto)

        await this.SessionsRepository.save(session)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })

        return { accessToken: accessToken }
    }
}