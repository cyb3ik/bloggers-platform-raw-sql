import { Query } from '@nestjs/cqrs';
import { UserViewDto } from '../../../api/dto/users.view-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query.repository';
import { NotFoundException } from '@nestjs/common';

export class FindUserByIdQuery extends Query<UserViewDto> {
    constructor(
        public readonly userId: string
    ) {
        super()
    }
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
    constructor(
        private readonly UsersQueryRepository: UsersQueryRepository) { }

    async execute(query: FindUserByIdQuery): Promise<UserViewDto> {
        const user = await this.UsersQueryRepository.getEntityById(
            query.userId
        )

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }
}