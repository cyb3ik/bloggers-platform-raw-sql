import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoSession, type SessionModelType } from "../domain/session-mongoose.entity";
import { SessionViewDto } from "../dto/session.view-dto";
import { RawSessionData } from "../dto/session.raw-dto";
import { ISessionQueryRepository } from "../../../core/interfaces/repositories/sessions/sessions-query-repository.interface";

Injectable()
export class SessionsQueryRepository implements ISessionQueryRepository {
    constructor(
        @InjectModel(MongoSession.name)
        private readonly SessionModel: SessionModelType,
    ) { }

    async getAllUserSessions(userId: string) {
        const userSessions = await this.SessionModel.find({ userId: userId }).lean()

        return userSessions.map(sessionDocument => {
            const sessionData = RawSessionData.createFromDocument(sessionDocument)

            return new SessionViewDto(sessionData)
        })
    }
}