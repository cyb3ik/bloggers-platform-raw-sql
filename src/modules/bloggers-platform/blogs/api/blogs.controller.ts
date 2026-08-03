import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogsQueryParams } from "./dto/blogs.query.params-dto";
import { PostsQueryParams } from "../../posts/api/dto/posts.query.params-dto";
import { CreateBlogInputDto, UpdateBlogInputDto } from "./dto/blogs.input-dto";
import { CreatePostForBlogInputDto } from "../../posts/api/dto/posts.input-dto";
import { Types } from "mongoose";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindAllBlogsQuery } from "../application/use-cases/queries/find-all-blogs.query";
import { FindBlogByIdQuery } from "../application/use-cases/queries/find-blog-by-id.query";
import { FindAllPostsFromBlogQuery } from "../application/use-cases/queries/find-all-posts-from-blog.query";
import { CreateBlogCommand } from "../application/use-cases/commands/create-blog.usecase";
import { CreatePostForBlogCommand } from "../application/use-cases/commands/create-post-for-blog.usecase";
import { FindPostByIdQuery } from "../../posts/application/use-cases/queries/find-post-by-id.query";
import { UpdateBlogCommand } from "../application/use-cases/commands/update-blog.usecase";
import { DeleteBlogCommand } from "../application/use-cases/commands/delete-blog.usecase";
import { BasicAuthGuard } from "../../../../core/guards/basic.auth.guard";
import { OptionalAccessTokenAuthGuard } from "../../../../core/guards/optional-access-token.auth.guard";
import { CheckGuestStatus } from "../../../../core/decorators/check-guest-status.decorator";
import { UserInfo } from "../../../users/api/dto/user-info.dto";

@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllBlogs(@Query() query: BlogsQueryParams) {

        return this.QueryBus.execute(new FindAllBlogsQuery(query))
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findBlogById(@Param('id') id: string) {

        return this.QueryBus.execute(new FindBlogByIdQuery(id))
    }

    @Get(':blogId/posts')
    @UseGuards(OptionalAccessTokenAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findAllPostsFromBlog(
        @CheckGuestStatus() user: UserInfo | null,
        @Param('blogId') blogId: string,
        @Query() query: PostsQueryParams) {

        if (user) {
            return this.QueryBus.execute(new FindAllPostsFromBlogQuery(blogId, query, user.id))
        }

        return this.QueryBus.execute(new FindAllPostsFromBlogQuery(blogId, query))
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createBlog(@Body() dto: CreateBlogInputDto) {

        const createdBlogId = await this.CommandBus.execute(new CreateBlogCommand(dto))

        return this.QueryBus.execute(new FindBlogByIdQuery(createdBlogId))
    }

    @Post(':blogId/posts')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPostForBlog(
        @Param('blogId') blogId: string,
        @Body() dto: CreatePostForBlogInputDto) {

        const createdPostId = await this.CommandBus.execute(new CreatePostForBlogCommand(blogId, dto))

        return this.QueryBus.execute(new FindPostByIdQuery(createdPostId))
    }

    @Put(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlogById(
        @Param('id') id: string,
        @Body() dto: UpdateBlogInputDto) {

        return this.CommandBus.execute(new UpdateBlogCommand(id, dto))
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById(@Param('id') id: string) {

        return this.CommandBus.execute(new DeleteBlogCommand(id))
    }
}