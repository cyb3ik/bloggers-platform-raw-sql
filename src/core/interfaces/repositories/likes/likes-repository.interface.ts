import { Like } from "../../../../modules/bloggers-platform/likes/domain/like-domain.entity";
import { LikeViewDto } from "../../../../modules/bloggers-platform/likes/dto/like-view.dto";
import { BaseRepository } from "../base-repository.interface";

export interface ILikesRepository extends BaseRepository<Like> {
    findLikeByUserId(entityId: string, userId: string): Promise<Like | null>
}