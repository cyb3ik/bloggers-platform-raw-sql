import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../core/guards/basic.auth.guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CreateBlogInputDto, UpdateBlogInputDto } from "../bloggers-platform/blogs/api/dto/blogs.input-dto";
import { CreateBlogCommand } from "../bloggers-platform/blogs/application/use-cases/commands/create-blog.usecase";
import { FindBlogByIdQuery } from "../bloggers-platform/blogs/application/use-cases/queries/find-blog-by-id.query";
import { UpdateBlogCommand } from "../bloggers-platform/blogs/application/use-cases/commands/update-blog.usecase";
import { DeleteBlogCommand } from "../bloggers-platform/blogs/application/use-cases/commands/delete-blog.usecase";
import { BlogsQueryParams } from "../bloggers-platform/blogs/api/dto/blogs.query.params-dto";
import { FindAllBlogsQuery } from "../bloggers-platform/blogs/application/use-cases/queries/find-all-blogs.query";

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
@SkipThrottle()
export class SaBlogsController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllBlogs(@Query() query: BlogsQueryParams) {

        return this.QueryBus.execute(new FindAllBlogsQuery(query))
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBlog(@Body() dto: CreateBlogInputDto) {

        const createdBlogId = await this.CommandBus.execute(new CreateBlogCommand(dto))

        return this.QueryBus.execute(new FindBlogByIdQuery(createdBlogId))
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlogById(
        @Param('id') id: string,
        @Body() dto: UpdateBlogInputDto) {

        return this.CommandBus.execute(new UpdateBlogCommand(id, dto))
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById(@Param('id') id: string) {

        return this.CommandBus.execute(new DeleteBlogCommand(id))
    }
}