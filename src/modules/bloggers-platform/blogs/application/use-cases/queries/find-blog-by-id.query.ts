import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../../api/dto/blogs.view-dto';
import { BlogsQueryRepository } from '../../../infrastructure/blogs.query.repository';

export class FindBlogByIdQuery extends Query<BlogViewDto> {
    constructor(
        public readonly blogId: string
    ) {
        super()
    }
}

@QueryHandler(FindBlogByIdQuery)
export class FindBlogByIdQueryHandler implements IQueryHandler<FindBlogByIdQuery> {
    constructor(
        private readonly BlogsQueryRepository: BlogsQueryRepository) { }

    async execute(query: FindBlogByIdQuery): Promise<BlogViewDto> {
        const blog = await this.BlogsQueryRepository.getEntityById(
            query.blogId
        )

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        return blog
    }
}