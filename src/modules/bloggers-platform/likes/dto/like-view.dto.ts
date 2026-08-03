import { RawLikeData } from "./like.raw-dto"

export class LikeViewDto {
    addedAt: string
    userId: string
    login: string

    constructor(data: RawLikeData) {
        this.addedAt = data.createdAt.toISOString()
        this.userId = data.userId.toString()
        this.login = data.userLogin
    }
}