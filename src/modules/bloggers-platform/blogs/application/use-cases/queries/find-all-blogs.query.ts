import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../../../core/dto/paginated.view-dto';
import { BlogViewDto } from '../../../api/dto/blogs.view-dto';
import { BlogsQueryParams } from '../../../api/dto/blogs.query.params-dto';
import { BlogsQueryRepository } from '../../../infrastructure/blogs.query.repository';

export class FindAllBlogsQuery extends Query<PaginatedViewDto<BlogViewDto[]>> {
    constructor(
        public readonly query: BlogsQueryParams
    ) {
        super()
    }
}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsQueryHandler implements IQueryHandler<FindAllBlogsQuery> {
    constructor(
        private readonly BlogsQueryRepository: BlogsQueryRepository) { }

    async execute(query: FindAllBlogsQuery): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const blogs = await this.BlogsQueryRepository.getAllEntities(query.query)

        return blogs
    }
}