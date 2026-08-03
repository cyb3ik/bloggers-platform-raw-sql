import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostsQueryParams } from "../api/dto/posts.query.params-dto";
import { IPostsQueryRepository } from "../../../../core/interfaces/repositories/posts/posts-query-repository.interface";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { PostViewDto } from "../api/dto/posts.view-dto";
import { MongoPost, type PostModelType } from "../domain/post-mongoose.entity";
import { RawPostData } from "../domain/dto/posts.raw-dto";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";


@Injectable()
export class PostsQueryRepository implements IPostsQueryRepository {
    constructor(
        @InjectModel(MongoPost.name)
        private readonly PostModel: PostModelType,
        private readonly LikesQueryRepository: LikesQueryRepository
    ) { }

    async getEntityById(id: string, userId?: string): Promise<PostViewDto | null> {
        const postDocument = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!postDocument) {
            return null
        }

        const postData = RawPostData.createFromDocument(postDocument)

        const likesInfo = await this.LikesQueryRepository.getPostLikesInfo(id, userId)

        return new PostViewDto(postData, likesInfo)
    }

    async getAllEntities(query: PostsQueryParams, userId?: string) {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean()

        const totalCount = await this.PostModel.countDocuments(filter)

        const mappedResult = []

        for (const item of result) {
            const postData = RawPostData.createFromDocument(item)

            const likesInfo = await this.LikesQueryRepository.getPostLikesInfo(item.id, userId)

            mappedResult.push(new PostViewDto(postData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    async getAllPostsFromBlog(blogId: string, query: PostsQueryParams, userId?: string) {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const filter: any = { blogId: blogId, deletedAt: null }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        const mappedResult = []

        for (const item of result) {
            const postData = RawPostData.createFromDocument(item)

            const likesInfo = await this.LikesQueryRepository.getPostLikesInfo(item.id, userId)

            mappedResult.push(new PostViewDto(postData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
