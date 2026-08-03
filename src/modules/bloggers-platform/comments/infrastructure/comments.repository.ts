import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoComment, type CommentModelType } from "../domain/comment-mongoose.entity";
import { BaseRepository } from "../../../../core/interfaces/repositories/base-repository.interface";
import { Comment } from "../domain/comment-domain.entity";
import { RawCommentData } from "../domain/dto/comment.raw-dto";

@Injectable()
export class CommentsRepository implements BaseRepository<Comment> {
    constructor(@InjectModel(MongoComment.name) private readonly CommentModel: CommentModelType) { }

    async save(comment: Comment) {
        const data = comment.getPersistenceData()

        await this.CommentModel.updateOne(
            { _id: comment.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Comment | null> {
        const commentDocument = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!commentDocument) {
            return null
        }

        const commentData = RawCommentData.createFromDocument(commentDocument)

        return new Comment(commentData)
    }
}