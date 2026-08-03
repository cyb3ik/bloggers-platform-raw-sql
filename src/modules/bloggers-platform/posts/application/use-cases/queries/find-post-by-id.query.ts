import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';
import { PostViewDto } from '../../../api/dto/posts.view-dto';

export class FindPostByIdQuery extends Query<PostViewDto> {
    constructor(
        public readonly postId: string,
        public readonly userId?: string
    ) {
        super()
    }
}

@QueryHandler(FindPostByIdQuery)
export class FindPostByIdQueryHandler implements IQueryHandler<FindPostByIdQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository
    ) { }

    async execute(query: FindPostByIdQuery): Promise<PostViewDto> {
        const post = await this.PostsQueryRepository.getEntityById(query.postId, query.userId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        return post
    }
}