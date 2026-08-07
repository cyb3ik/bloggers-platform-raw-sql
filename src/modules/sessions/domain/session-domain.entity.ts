import { RawSessionData } from "../dto/session.raw-dto"

export class Session {
    public id: string
    private ip: string
    private title: string
    private lastActiveDate: number
    private deviceId: string
    private userId: string
    private exp: number

    constructor(dto: RawSessionData) {
        this.id = dto.id
        this.ip = dto.ip
        this.title = dto.title
        this.lastActiveDate = dto.lastActiveDate
        this.deviceId = dto.deviceId
        this.userId = dto.userId
        this.exp = dto.exp
    }

    getPersistenceData() {
        return {
            ip: this.ip,
            title: this.title,
            lastActiveDate: this.lastActiveDate,
            deviceId: this.deviceId,
            userId: this.userId,
            exp: this.exp,
        }
    }

    update(timestamp: number) {
        this.lastActiveDate = timestamp
    }
}