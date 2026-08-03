import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostsQueryRepository } from '../../../../posts/infrastructure/posts.query.repository';
import { PostViewDto } from '../../../../posts/api/dto/posts.view-dto';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryParams } from '../../../../posts/api/dto/posts.query.params-dto';
import { BlogsQueryRepository } from '../../../infrastructure/blogs.query.repository';

export class FindAllPostsFromBlogQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly blogId: string,
        public readonly query: PostsQueryParams,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindAllPostsFromBlogQuery)
export class FindAllPostsFromBlogQueryHandler implements IQueryHandler<FindAllPostsFromBlogQuery> {
    constructor(
        private readonly BlogsQueryRepository: BlogsQueryRepository,
        private readonly PostsQueryRepository: PostsQueryRepository
    ) { }

    async execute(query: FindAllPostsFromBlogQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
        const blog = await this.BlogsQueryRepository.getEntityById(query.blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const result = await this.PostsQueryRepository.getAllPostsFromBlog(query.blogId, query.query, query.userId)

        return result
    }
}