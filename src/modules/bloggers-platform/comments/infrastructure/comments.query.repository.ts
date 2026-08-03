import { Injectable } from "@nestjs/common";
import { MongoComment, type CommentModelType } from "../domain/comment-mongoose.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CommentViewDto } from "../api/dto/comments.view-dto";
import { CommentsQueryParams } from "../api/dto/comments.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { ICommentsQueryRepository } from "../../../../core/interfaces/repositories/comments/commets-query-repository.interface";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";
import { RawCommentData } from "../domain/dto/comment.raw-dto";

@Injectable()
export class CommentsQueryRepository implements ICommentsQueryRepository {
    constructor(
        @InjectModel(MongoComment.name)
        private readonly CommentModel: CommentModelType,
        private readonly LikesQueryRepository: LikesQueryRepository
    ) { }

    async getEntityById(id: string, userId?: string): Promise<CommentViewDto | null> {
        const commentDocument = await this.CommentModel.findOne({
            _id: id,
            deletedAt: null,
        })

        if (!commentDocument) {
            return null
        }

        const commentData = RawCommentData.createFromDocument(commentDocument)

        const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(id, userId)

        return new CommentViewDto(commentData, likesInfo)
    }

    async getAllEntities(query: CommentsQueryParams, userId?: string): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        const result = await this.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.CommentModel.countDocuments(filter)

        const mappedResult = []

        for (const item of result) {
            const commentData = RawCommentData.createFromDocument(item)

            const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(item.id, userId)

            mappedResult.push(new CommentViewDto(commentData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    async getAllCommentsFromPost(postId: string, query: CommentsQueryParams, userId?: string): Promise<PaginatedViewDto<CommentViewDto[]>> {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { postId: postId, deletedAt: null }

        const result = await this.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.CommentModel.countDocuments(filter)

        const mappedResult = []

        for (const item of result) {
            const commentData = RawCommentData.createFromDocument(item)

            const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(item.id, userId)

            mappedResult.push(new CommentViewDto(commentData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}