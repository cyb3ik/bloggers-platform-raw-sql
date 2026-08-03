import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MePageView } from '../../../api/dto/view/me-page-view.dto';
import { AuthService } from '../../auth.service';

export class GetMePageQuery extends Query<MePageView> {
    constructor(
        public readonly userId: string
    ) {
        super()
    }
}

@QueryHandler(GetMePageQuery)
export class GetMePageQueryHandler implements IQueryHandler<GetMePageQuery> {
    constructor(
        private readonly AuthService: AuthService) { }

    async execute(query: GetMePageQuery): Promise<MePageView> {
        return this.AuthService.getMePage(query.userId)
    }
}