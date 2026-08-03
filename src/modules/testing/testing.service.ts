import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoBlog, type BlogModelType } from "../bloggers-platform/blogs/domain/blog-mongoose.entity";
import { MongoUser, type UserModelType } from "../users/domain/user-mongoose.entity";
import { MongoLike, type LikeModelType } from "../bloggers-platform/likes/domain/like-mongoose.entity";
import { MongoPost, type PostModelType } from "../bloggers-platform/posts/domain/post-mongoose.entity";
import { MongoComment, type CommentModelType } from "../bloggers-platform/comments/domain/comment-mongoose.entity";
import { MongoRequest, type RequestModelType } from "../../core/requests/entity/request-mongoose.entity";
import { MongoSession, type SessionModelType } from "../sessions/domain/session-mongoose.entity";

@Injectable()
export class TestingService {
    constructor(
        @InjectModel(MongoUser.name)
        private readonly UserModel: UserModelType,
        @InjectModel(MongoBlog.name)
        private readonly BlogModel: BlogModelType,
        @InjectModel(MongoPost.name)
        private readonly PostModel: PostModelType,
        @InjectModel(MongoComment.name)
        private readonly CommentModel: CommentModelType,
        @InjectModel(MongoLike.name)
        private readonly LikeModel: LikeModelType,
        @InjectModel(MongoSession.name)
        private readonly SessionModel: SessionModelType,
        @InjectModel(MongoRequest.name)
        private readonly RequestModel: RequestModelType

    ) { }

    async deleteAll() {
        await this.UserModel.deleteMany({})
        await this.BlogModel.deleteMany({})
        await this.PostModel.deleteMany({})
        await this.CommentModel.deleteMany({})
        await this.LikeModel.deleteMany({})
        await this.SessionModel.deleteMany({})
        await this.RequestModel.deleteMany({})
    }
}