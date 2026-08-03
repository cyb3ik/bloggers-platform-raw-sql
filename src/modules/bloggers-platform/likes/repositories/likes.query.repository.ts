import { Injectable } from "@nestjs/common";
import { MongoLike, type LikeModelType } from "../domain/like-mongoose.entity"
import { ILikesQueryRepository } from "../../../../core/interfaces/repositories/likes/likes-query-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { LikeViewDto } from "../dto/like-view.dto";
import { LikeStatus, RawLikeData } from "../dto/like.raw-dto";
import { ExtendedPostLikesInfo } from "../../posts/api/dto/posts.view-dto";
import { CommentLikesInfo } from "../../comments/api/dto/comments.view-dto";

@Injectable()
export class LikesQueryRepository implements ILikesQueryRepository {
    constructor(@InjectModel(MongoLike.name) private readonly LikeModel: LikeModelType) { }

    async getNewestLikesFromEntity(entityId: string): Promise<LikeViewDto[]> {
        const items = await this.LikeModel
            .find(
                {
                    entityId: entityId,
                    status: "Like"
                }
            )
            .sort({ createdAt: -1 })
            .limit(3)
            .lean()

        return items.map(likeDocument => {
            const likeData = RawLikeData.createFromDocument(likeDocument)

            return new LikeViewDto(likeData)
        })
    }

    async getUserStatus(entityId: string, userId?: string): Promise<LikeStatus> {
        if (!userId) {
            return LikeStatus.None
        }

        const likeDocument = await this.LikeModel.findOne(
            {
                entityId: entityId,
                userId: userId
            }
        ).lean()

        if (!likeDocument) {
            return LikeStatus.None
        }

        return likeDocument.status
    }

    async getLikesAndDislikesCount(entityId: string): Promise<{ likesCount: number, dislikesCount: number }> {
        const likesCount = await this.LikeModel.countDocuments({
            entityId: entityId,
            status: "Like"
        })

        const dislikesCount = await this.LikeModel.countDocuments({
            entityId: entityId,
            status: "Dislike"
        })

        return { likesCount: likesCount, dislikesCount: dislikesCount }
    }

    async getPostLikesInfo(entityId: string, userId?: string): Promise<ExtendedPostLikesInfo> {
        const { likesCount, dislikesCount } = await this.getLikesAndDislikesCount(entityId)

        const status = await this.getUserStatus(entityId, userId)

        const newestLikes = await this.getNewestLikesFromEntity(entityId)

        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: status,
            newestLikes: newestLikes
        }
    }

    async getCommentLikesInfo(entityId: string, userId?: string): Promise<CommentLikesInfo> {
        const { likesCount, dislikesCount } = await this.getLikesAndDislikesCount(entityId)

        const status = await this.getUserStatus(entityId, userId)

        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: status
        }
    }
}