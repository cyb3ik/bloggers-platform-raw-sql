import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionInfo } from '../../dto/session-info.dto';
import { SessionViewDto } from '../../dto/session.view-dto';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { SessionsQueryRepository } from '../../infrastructure/sessions.query.repository';

export class FindAllUserSessionsQuery extends Query<SessionViewDto[]> {
    constructor(
        public readonly session: SessionInfo
    ) {
        super()
    }
}

@QueryHandler(FindAllUserSessionsQuery)
export class FindAllUserSessionsQueryHandler implements IQueryHandler<FindAllUserSessionsQuery> {
    constructor(
        private readonly SessionsQueryRepository: SessionsQueryRepository) { }

    async execute(query: FindAllUserSessionsQuery): Promise<SessionViewDto[]> {
        const userId = query.session.userId

        const sessions = await this.SessionsQueryRepository.getAllUserSessions(userId)

        return sessions
    }
}