import { LikeViewDto } from "../../../../modules/bloggers-platform/likes/dto/like-view.dto"

export interface ILikesQueryRepository {
    getNewestLikesFromEntity(entityId: string): Promise<LikeViewDto[]>
    getLikesAndDislikesCount(entityId: string): Promise<{ likesCount: number, dislikesCount: number }>
}
