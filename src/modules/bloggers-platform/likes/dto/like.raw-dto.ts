export class RawLikeData {
    id: string
    userId: string
    entityId: string
    userLogin: string
    status: LikeStatus
    createdAt: Date

    static createFromDocument(document: any) {
        const data = new this()

        data.id = document._id.toString()
        data.userId = document.userId
        data.entityId = document.entityId
        data.userLogin = document.userLogin
        data.status = document.status
        data.createdAt = document.createdAt

        return data
    }
}

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}