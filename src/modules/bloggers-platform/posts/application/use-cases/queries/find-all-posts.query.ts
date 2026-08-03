import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { PostViewDto } from '../../../api/dto/posts.view-dto';
import { PostsQueryParams } from '../../../api/dto/posts.query.params-dto';
import { PostsQueryRepository } from '../../../infrastructure/posts.query.repository';

export class FindAllPostsQuery extends Query<PaginatedViewDto<PostViewDto[]>> {
    constructor(
        public readonly query: PostsQueryParams,
        public readonly userId?: string
    ) {
        super()
    }
}

@QueryHandler(FindAllPostsQuery)
export class FindAllPostsQueryHandler implements IQueryHandler<FindAllPostsQuery> {
    constructor(
        private readonly PostsQueryRepository: PostsQueryRepository
    ) { }

    async execute(query: FindAllPostsQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
        const result = await this.PostsQueryRepository.getAllEntities(query.query, query.userId)

        return result
    }
}