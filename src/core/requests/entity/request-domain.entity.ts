export class Request {
    public id: string
    private ip: string
    private url: string
    private date: Date

    constructor(dto: { id: string, ip: string, url: string, date: Date }) {
        this.id = dto.id
        this.ip = dto.ip
        this.url = dto.url
        this.date = dto.date
    }

    getPersistenceData() {
        return {
            ip: this.ip,
            url: this.url,
            date: this.date
        }
    }
}