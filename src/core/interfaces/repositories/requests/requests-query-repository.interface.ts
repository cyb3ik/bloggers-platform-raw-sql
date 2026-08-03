export interface IRequestsQueryRepository {
    getRequestsRate(ip: string, url: string, date: Date): Promise<number>
}