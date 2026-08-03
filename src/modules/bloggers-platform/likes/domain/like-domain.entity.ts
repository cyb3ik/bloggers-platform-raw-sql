import { LikeStatus, RawLikeData } from "../dto/like.raw-dto"

export class Like {
    public id: string
    public userId: string
    public entityId: string
    public userLogin: string
    public status: LikeStatus
    public createdAt: Date
    private deletedAt: Date | null = null

    constructor(dto: RawLikeData) {
        this.id = dto.id
        this.userId = dto.userId
        this.entityId = dto.entityId
        this.userLogin = dto.userLogin
        this.status = dto.status
        this.createdAt = dto.createdAt
    }

    getPersistenceData() {
        return {
            status: this.status
        }
    }

    updateLikeStatus(status: LikeStatus) {
        this.status = status
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted')
        }
        this.deletedAt = new Date()
    }
}