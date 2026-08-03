import { SessionViewDto } from "../../../../modules/sessions/dto/session.view-dto";

export interface ISessionQueryRepository {
    getAllUserSessions(userId: string): Promise<SessionViewDto[]>
}