import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentViewDto } from '../../../api/dto/comments.view-dto';
import { CommentsQueryRepository } from '../../../infrastructure/comments.query.repository';
import { LikeStatus } from '../../../../likes/dto/like.raw-dto';

export class FindCommentByIdQuery extends Query<CommentViewDto> {
    constructor(
        public readonly commentId: string,
        public readonly userId?: string,
    ) {
        super()
    }
}

@QueryHandler(FindCommentByIdQuery)
export class FindCommentByIdQueryHandler implements IQueryHandler<FindCommentByIdQuery> {
    constructor(
        private readonly CommentsQueryRepository: CommentsQueryRepository
    ) { }

    async execute(query: FindCommentByIdQuery): Promise<CommentViewDto> {
        const comment = await this.CommentsQueryRepository.getEntityById(
            query.commentId, query.userId
        )

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return comment
    }
}