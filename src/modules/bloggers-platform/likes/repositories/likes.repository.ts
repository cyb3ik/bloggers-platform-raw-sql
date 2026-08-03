import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { LikeViewDto } from "../dto/like-view.dto"
import { ILikesRepository } from "../../../../core/interfaces/repositories/likes/likes-repository.interface"
import { MongoLike, type LikeModelType } from "../domain/like-mongoose.entity"
import { Like } from "../domain/like-domain.entity"
import { RawLikeData } from "../dto/like.raw-dto"

@Injectable()
export class LikesRepository implements ILikesRepository {
    constructor(@InjectModel(MongoLike.name) private readonly LikeModel: LikeModelType) { }

    async save(like: Like) {
        const data = like.getPersistenceData()

        await this.LikeModel.updateOne(
            { _id: like.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Like | null> {
        const likeDocument = await this.LikeModel.findOne(
            {
                _id: id
            }
        ).lean()

        if (!likeDocument) {
            return null
        }

        const likeData = RawLikeData.createFromDocument(likeDocument)

        return new Like(likeData)
    }

    async findLikeByUserId(entityId: string, userId: string) {
        const likeDocument = await this.LikeModel.findOne(
            {
                entityId: entityId,
                userId: userId
            }
        ).lean()

        if (!likeDocument) {
            return null
        }

        const likeData = RawLikeData.createFromDocument(likeDocument)

        return new Like(likeData)
    }
}