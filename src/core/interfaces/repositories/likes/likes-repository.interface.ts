import { Like } from "../../../../modules/bloggers-platform/likes/domain/like-domain.entity";

export interface ILikesRepository {
    save(like: Like): void
    findLikeByUserId(entityId: string, userId: string): Promise<Like | null>
}