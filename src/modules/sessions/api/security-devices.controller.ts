import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RefreshTokenGuard } from "../../../core/guards/refresh-token.guard";
import { ExtractSessionInfoFromRequest } from "../../../core/decorators/extract-session-info.decorator";
import { SessionInfo } from "../dto/session-info.dto";
import { FindAllUserSessionsQuery } from "../use-cases/queries/find-all-user-sessions.query";
import { DeleteAllSessionExceptCurrentCommand } from "../use-cases/commands/delete-all-sessions-except-current.usecase";
import { DeleteSpecifiedSessionCommand } from "../use-cases/commands/delete-specified-session.usecase";

@Controller('security/devices')
export class SecurityDevicesController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(RefreshTokenGuard)
    async findAllUserSessions(
        @ExtractSessionInfoFromRequest() sessionInfo: SessionInfo
    ) {
        return this.QueryBus.execute(new FindAllUserSessionsQuery(sessionInfo))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    @UseGuards(RefreshTokenGuard)
    async deleteAllSessionExceptCurrent(
        @ExtractSessionInfoFromRequest() sessionInfo: SessionInfo
    ) {
        return this.CommandBus.execute(new DeleteAllSessionExceptCurrentCommand(sessionInfo))
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':deviceId')
    @UseGuards(RefreshTokenGuard)
    async deleteSpecifiedSession(
        @ExtractSessionInfoFromRequest() sessionInfo: SessionInfo,
        @Param('deviceId') deviceId: string
    ) {
        return this.CommandBus.execute(new DeleteSpecifiedSessionCommand(sessionInfo, deviceId))
    }

}