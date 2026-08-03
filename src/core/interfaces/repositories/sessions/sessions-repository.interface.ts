import { Session } from "../../../../modules/sessions/domain/session-domain.entity";
import { BaseRepository } from "../base-repository.interface";

export interface ISessionsRepository extends BaseRepository<Session> {

    findSessionByDeviceId(deviceId: string): Promise<Session>

    findSessionByDeviceAndUserId(userId: string, deviceId: string): Promise<Session>

    findSession(userId: string, deviceId: string, iat: number): Promise<Session>

    deleteSpecifiedDeviceSession(userId: string, deviceId: string): Promise<void>

    deleteAllUserSessionsExceptCurrent(userId: string, deviceId: string): Promise<void>

}