import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../core/guards/basic.auth.guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CreatePostForBlogInputDto, UpdatePostInputDto } from "../bloggers-platform/posts/api/dto/posts.input-dto";
import { CreatePostForBlogCommand } from "../bloggers-platform/blogs/application/use-cases/commands/create-post-for-blog.usecase";
import { FindPostByIdQuery } from "../bloggers-platform/posts/application/use-cases/queries/find-post-by-id.query";
import { PostsQueryParams } from "../bloggers-platform/posts/api/dto/posts.query.params-dto";
import { FindAllPostsFromBlogQuery } from "../bloggers-platform/blogs/application/use-cases/queries/find-all-posts-from-blog.query";
import { UpdatePostCommand } from "../bloggers-platform/posts/application/use-cases/commands/update-post.usecase";
import { DeletePostCommand } from "../bloggers-platform/posts/application/use-cases/commands/delete-post.usecase";

@Controller('sa/blogs/:blogId/posts')
@UseGuards(BasicAuthGuard)
@SkipThrottle()
export class SaPostsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllPostsFromBlog(
        @Param('blogId') blogId: string,
        @Query() query: PostsQueryParams
    ) {

        return this.QueryBus.execute(new FindAllPostsFromBlogQuery(blogId, query))
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPostForBlog(
        @Param('blogId') blogId: string,
        @Body() dto: CreatePostForBlogInputDto
    ) {

        const createdPostId = await this.CommandBus.execute(new CreatePostForBlogCommand(blogId, dto))

        return this.QueryBus.execute(new FindPostByIdQuery(createdPostId))
    }

    @Put(':postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePostById(
        @Param('blogId') blogId: string,
        @Param('postId') id: string,
        @Body() dto: UpdatePostInputDto
    ) {

        return this.CommandBus.execute(new UpdatePostCommand(blogId, id, dto))
    }

    @Delete(':postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById(
        @Param('blogId') blogId: string,
        @Param('postId') id: string
    ) {
        return this.CommandBus.execute(new DeletePostCommand(blogId, id))
    }

}