import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { BlogsQueryParams } from "./dto/blogs.query.params-dto";
import { PostsQueryParams } from "../../posts/api/dto/posts.query.params-dto";
import { FindAllBlogsQuery } from "../application/use-cases/queries/find-all-blogs.query";
import { FindBlogByIdQuery } from "../application/use-cases/queries/find-blog-by-id.query";
import { FindAllPostsFromBlogQuery } from "../application/use-cases/queries/find-all-posts-from-blog.query";
import { OptionalAccessTokenAuthGuard } from "../../../../core/guards/optional-access-token.auth.guard";
import { CheckGuestStatus } from "../../../../core/decorators/check-guest-status.decorator";
import { UserInfo } from "../../../users/api/dto/user-info.dto";
import { QueryBus } from "@nestjs/cqrs";

@Controller('blogs')
export class BlogsController {
    constructor(
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

}