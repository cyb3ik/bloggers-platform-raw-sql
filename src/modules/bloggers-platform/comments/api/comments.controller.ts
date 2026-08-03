import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindCommentByIdQuery } from "../application/use-cases/queries/find-comment-by-id.query";
import { UpdateCommentCommand } from "../application/use-cases/commands/update-comment.usecase";
import { UpdateCommentInputDto } from "./dto/comments.input-dto";
import { DeleteCommentCommand } from "../application/use-cases/commands/delete-comment.usecase";
import { AccessTokenAuthGuard } from "../../../../core/guards/access-token.auth.guard";
import { ExtractUserFromRequest } from "../../../../core/decorators/extract-user.decorator";
import { UserInfo } from "../../../users/api/dto/user-info.dto";
import { OptionalAccessTokenAuthGuard } from "../../../../core/guards/optional-access-token.auth.guard";
import { CheckGuestStatus } from "../../../../core/decorators/check-guest-status.decorator";
import { ChangeLikeStatusInputDto } from "../../likes/dto/change-like-status-input.dto";
import { ChangeLikeStatusOnCommentCommand } from "../application/use-cases/commands/change-like-status-on-comment.usecase";

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus,
    ) { }

    @Get(':id')
    @UseGuards(OptionalAccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findCommentById(
        @CheckGuestStatus() user: UserInfo | null,
        @Param('id') id: string
    ) {

        if (user) {
            return this.QueryBus.execute(new FindCommentByIdQuery(id, user.id))
        }

        return this.QueryBus.execute(new FindCommentByIdQuery(id))
    }

    @Put(':commentId/like-status')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async changeLikeStatus(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('commentId') commentId: string,
        @Body() dto: ChangeLikeStatusInputDto
    ) {

        return this.CommandBus.execute(new ChangeLikeStatusOnCommentCommand(commentId, user, dto))
    }

    @Put(':id')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentById(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('id') id: string,
        @Body() dto: UpdateCommentInputDto
    ) {

        return this.CommandBus.execute(new UpdateCommentCommand(id, dto, user.id))
    }

    @Delete(':id')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCommentById(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('id') id: string
    ) {

        return this.CommandBus.execute(new DeleteCommentCommand(id, user.id))
    }
}