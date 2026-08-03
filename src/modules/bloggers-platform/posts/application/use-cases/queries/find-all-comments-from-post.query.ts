import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { NotFoundException } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../../comments/infrastructure/comments.query.repository';
import { CommentViewDto } from '../../../../comments/api/dto/comments.view-dto';
import { CommentsQueryParams } from '../../../../comments/api/dto/comments.query.params-dto';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';

export class FindAllCommentsFromPostQuery extends Query<PaginatedViewDto<CommentViewDto[]>> {
    constructor(
        public readonly postId: string,
        public readonly query: CommentsQueryParams,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindAllCommentsFromPostQuery)
export class FindAllCommentsFromPostQueryHandler implements IQueryHandler<FindAllCommentsFromPostQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository,
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    async execute(query: FindAllCommentsFromPostQuery): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const post = await this.PostsQueryRepository.getEntityById(query.postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const result = await this.CommentsQueryRepository.getAllCommentsFromPost(query.postId, query.query, query.userId)

        return result
    }
}