import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ISessionsRepository } from "../../../core/interfaces/repositories/sessions/sessions-repository.interface";
import { MongoSession, type SessionModelType } from "../domain/session-mongoose.entity";
import { Session } from "../domain/session-domain.entity";
import { RawSessionData } from "../dto/session.raw-dto";

@Injectable()
export class SessionsRepository implements ISessionsRepository {
    constructor(
        @InjectModel(MongoSession.name)
        private readonly SessionModel: SessionModelType,
    ) { }

    async save(session: Session) {
        const data = session.getPersistenceData()

        await this.SessionModel.updateOne(
            { _id: session.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Session | null> {
        const sessionDocument = await this.SessionModel.findOne({
            _id: id
        }).lean()

        if (!sessionDocument) {
            return null
        }

        const sessionData = RawSessionData.createFromDocument(sessionDocument)

        return new Session(sessionData)
    }

    async findSessionByDeviceId(deviceId: string) {
        const sessionDocument = await this.SessionModel.findOne({
            deviceId: deviceId
        }).lean()

        if (!sessionDocument) {
            return null
        }

        const sessionData = RawSessionData.createFromDocument(sessionDocument)

        return new Session(sessionData)
    }

    async findSessionByDeviceAndUserId(userId: string, deviceId: string) {
        const sessionDocument = await this.SessionModel.findOne({
            userId: userId,
            deviceId: deviceId
        }).lean()

        if (!sessionDocument) {
            return null
        }

        const sessionData = RawSessionData.createFromDocument(sessionDocument)

        return new Session(sessionData)
    }


    async findSession(userId: string, deviceId: string, iat: number) {
        const sessionDocument = await this.SessionModel.findOne({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: iat
        }).lean()

        if (!sessionDocument) {
            return null
        }

        const sessionData = RawSessionData.createFromDocument(sessionDocument)

        return new Session(sessionData)
    }

    async deleteSpecifiedDeviceSession(userId: string, deviceId: string) {
        await this.SessionModel.deleteOne({
            userId: userId,
            deviceId: deviceId
        })

        return
    }

    async deleteAllUserSessionsExceptCurrent(userId: string, deviceId: string) {
        await this.SessionModel.deleteMany({
            userId: userId,
            deviceId: { $ne: deviceId }
        })

        return
    }
}