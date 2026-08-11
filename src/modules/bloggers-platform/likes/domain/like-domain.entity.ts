import { LikeStatus, RawLikeData } from "../dto/like.raw-dto"

export class Like {
    public id: string
    private userId: string
    private entityId: string
    private userLogin: string
    private status: LikeStatus
    private createdAt: Date
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
            userId: this.userId,
            entityId: this.entityId,
            userLogin: this.userLogin,
            status: this.status,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt
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