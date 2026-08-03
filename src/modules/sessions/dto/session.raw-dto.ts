export class RawSessionData {
    id: string
    ip: string
    title: string
    lastActiveDate: number
    deviceId: string
    userId: string
    exp: number

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.ip = document.ip
        data.title = document.title
        data.lastActiveDate = document.lastActiveDate
        data.deviceId = document.deviceId
        data.userId = document.userId
        data.exp = document.exp

        return data
    }
}