import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PostsQueryParams } from "./dto/posts.query.params-dto";
import { CommentsQueryParams } from "../../comments/api/dto/comments.query.params-dto";
import { CreatePostInputDto, UpdatePostInputDto } from "./dto/posts.input-dto";
import { Types } from "mongoose";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindAllPostsQuery } from "../application/use-cases/queries/find-all-posts.query";
import { FindPostByIdQuery } from "../application/use-cases/queries/find-post-by-id.query";
import { FindAllCommentsFromPostQuery } from "../application/use-cases/queries/find-all-comments-from-post.query";
import { CreateCommentInputDto } from "../../comments/api/dto/comments.input-dto";
import { ExtractUserFromRequest } from "../../../../core/decorators/extract-user.decorator";
import { CreatePostForBlogCommand } from "../../blogs/application/use-cases/commands/create-post-for-blog.usecase";
import { AccessTokenAuthGuard } from "../../../../core/guards/access-token.auth.guard";
import { CreateCommentForPostCommand } from "../application/use-cases/commands/create-comment-for-post.usecase";
import { FindCommentByIdQuery } from "../../comments/application/use-cases/queries/find-comment-by-id.query";
import { UpdatePostCommand } from "../application/use-cases/commands/update-post.usecase";
import { DeletePostCommand } from "../application/use-cases/commands/delete-post.usecase";
import { BasicAuthGuard } from "../../../../core/guards/basic.auth.guard";
import { UserInfo } from "../../../users/api/dto/user-info.dto";
import { ChangeLikeStatusInputDto } from "../../likes/dto/change-like-status-input.dto";
import { OptionalAccessTokenAuthGuard } from "../../../../core/guards/optional-access-token.auth.guard";
import { CheckGuestStatus } from "../../../../core/decorators/check-guest-status.decorator";
import { ChangeLikeStatusOnPostCommand } from "../application/use-cases/commands/change-like-status-on-post.usecase";


@Controller('posts')
export class PostsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @UseGuards(OptionalAccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findAllPosts(
        @CheckGuestStatus() user: UserInfo | null,
        @Query() query: PostsQueryParams
    ) {

        if (user) {
            return this.QueryBus.execute(new FindAllPostsQuery(query, user.id))
        }

        return this.QueryBus.execute(new FindAllPostsQuery(query))
    }

    @Get(':id')
    @UseGuards(OptionalAccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findPostById(
        @CheckGuestStatus() user: UserInfo | null,
        @Param('id') id: string
    ) {

        if (user) {
            return this.QueryBus.execute(new FindPostByIdQuery(id, user.id))
        }

        return this.QueryBus.execute(new FindPostByIdQuery(id))
    }

    @Get(':postId/comments')
    @UseGuards(OptionalAccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findAllCommentsFromPost(
        @CheckGuestStatus() user: UserInfo | null,
        @Param('postId') postId: string,
        @Query() query: CommentsQueryParams
    ) {

        if (user) {
            return this.QueryBus.execute(new FindAllCommentsFromPostQuery(postId, query, user.id))
        }

        return this.QueryBus.execute(new FindAllCommentsFromPostQuery(postId, query))
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() dto: CreatePostInputDto) {

        const blogId = dto.blogId

        const createdPostId = await this.CommandBus.execute(new CreatePostForBlogCommand(blogId, dto))

        return this.QueryBus.execute(new FindPostByIdQuery(createdPostId))
    }


    @Post(':postId/comments')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCommentForPost(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('postId') postId: string,
        @Body() dto: CreateCommentInputDto) {

        const createdCommentId = await this.CommandBus.execute(new CreateCommentForPostCommand(postId, user, dto))

        return this.QueryBus.execute(new FindCommentByIdQuery(createdCommentId))
    }

    @Put(':postId/like-status')
    @UseGuards(AccessTokenAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async changeLikeStatus(
        @ExtractUserFromRequest() user: UserInfo,
        @Param('postId') postId: string,
        @Body() dto: ChangeLikeStatusInputDto
    ) {

        return this.CommandBus.execute(new ChangeLikeStatusOnPostCommand(postId, user, dto))
    }

    @Put(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePostById(
        @Param('id') id: string,
        @Body() dto: UpdatePostInputDto) {

        return this.CommandBus.execute(new UpdatePostCommand(id, dto))
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById(@Param('id') id: string) {
        return this.CommandBus.execute(new DeletePostCommand(id))
    }
}