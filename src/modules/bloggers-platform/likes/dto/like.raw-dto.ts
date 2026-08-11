export class RawLikeData {
    id: string
    userId: string
    entityId: string
    userLogin: string
    status: LikeStatus
    createdAt: Date

    static createFromSqlRow(row: any): RawLikeData {
        const data = new this()

        data.id = row.id
        data.entityId = row.entity_id
        data.userId = row.user_id
        data.userLogin = row.user_login
        data.status = row.status
        data.createdAt = row.created_at

        return data
    }
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}