import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LoginInputDto } from "./dto/login.input-dto";
import { ConfirmationCode } from "./dto/confirmation-code.dto";
import { EmailInput } from "./dto/email.input-dto";
import { NewPasswordInput } from "./dto/new-password.input-dto";
import { AccessTokenAuthGuard } from "../../../core/guards/access-token.auth.guard";
import { ExtractUserFromRequest } from "../../../core/decorators/extract-user.decorator";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LoginUserCommand } from "../application/use-cases/commands/login-user.usecase";
import { CreateUserInputDto } from "../../users/api/dto/users.input-dto";
import { RegisterUserCommand } from "../application/use-cases/commands/register-user.usecase";
import { ConfirmUserEmailCommand } from "../application/use-cases/commands/confirm-user-email.usecase";
import { ResendConfirmationCodeCommand } from "../application/use-cases/commands/resend-confirmation-code.usecase";
import { RecoverUserPasswordCommand } from "../application/use-cases/commands/recover-user-password.usecase";
import { ChangeUserPasswordCommand } from "../application/use-cases/commands/change-user-password.usecase";
import { GetMePageQuery } from "../application/use-cases/queries/get-me-page.query";
import { type Request, type Response } from "express";
import { UserInfo } from "../../users/api/dto/user-info.dto";
import { RateLimitGuard } from "../../../core/guards/rate-limit.guard";
import { RefreshTokenGuard } from "../../../core/guards/refresh-token.guard";
import { ExtractSessionInfoFromRequest } from "../../../core/decorators/extract-session-info.decorator";
import { SessionInfo } from "../../sessions/dto/session-info.dto";
import { GenerateNewTokensCommand } from "../application/use-cases/commands/generate-new-tokens.usecase";
import { LogoutCommand } from "../application/use-cases/commands/logout.usecase";

@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async authUser(
        @Body() dto: LoginInputDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response) {
        return this.CommandBus.execute(new LoginUserCommand(dto, req, res))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration')
    async registerUser(@Body() dto: CreateUserInputDto) {
        return this.CommandBus.execute(new RegisterUserCommand(dto))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-confirmation')
    async confirmUserRegistration(@Body() dto: ConfirmationCode) {
        return this.CommandBus.execute(new ConfirmUserEmailCommand(dto.code))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-email-resending')
    async resendConfirmationCode(@Body() dto: EmailInput) {
        return this.CommandBus.execute(new ResendConfirmationCodeCommand(dto.email))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-recovery')
    async recoverUserPassword(@Body() dto: EmailInput) {
        return this.CommandBus.execute(new RecoverUserPasswordCommand(dto.email))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('new-password')
    async changeUserPassword(@Body() dto: NewPasswordInput) {
        return this.CommandBus.execute(new ChangeUserPasswordCommand(dto))
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    async generateNewTokens(
        @ExtractSessionInfoFromRequest() sessionInfo: SessionInfo,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.CommandBus.execute(new GenerateNewTokensCommand(sessionInfo, res))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshTokenGuard)
    @Post('logout')
    async logout(
        @ExtractSessionInfoFromRequest() sessionInfo: SessionInfo
    ) {
        return this.CommandBus.execute(new LogoutCommand(sessionInfo))
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenAuthGuard)
    @Get('me')
    async getMePage(@ExtractUserFromRequest() user: UserInfo) {
        return this.QueryBus.execute(new GetMePageQuery(user.id))
    }
}