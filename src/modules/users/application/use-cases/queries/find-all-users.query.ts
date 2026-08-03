import { Query } from '@nestjs/cqrs';
import { UserViewDto } from '../../../api/dto/users.view-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query.repository';
import { UsersQueryParams } from '../../../api/dto/users.query.params-dto';
import { PaginatedViewDto } from '../../../../../core/dto/paginated.view-dto';

export class FindAllUsersQuery extends Query<PaginatedViewDto<UserViewDto[]>> {
    constructor(
        public readonly query: UsersQueryParams
    ) {
        super()
    }
}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler implements IQueryHandler<FindAllUsersQuery> {
    constructor(
        private readonly UsersQueryRepository: UsersQueryRepository) { }

    async execute(query: FindAllUsersQuery): Promise<PaginatedViewDto<UserViewDto[]>> {
        const users = await this.UsersQueryRepository.getAllEntities(query.query)

        return users
    }
}