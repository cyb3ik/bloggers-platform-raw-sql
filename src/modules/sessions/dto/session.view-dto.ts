import { RawSessionData } from "./session.raw-dto"

export class SessionViewDto {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string

    constructor(data: RawSessionData) {
        this.ip = data.ip
        this.title = data.title
        this.lastActiveDate = new Date(Number(data.lastActiveDate) * 1000).toISOString()
        this.deviceId = data.deviceId
    }
}