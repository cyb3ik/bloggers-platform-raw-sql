import { UpdateCommentInputDto } from "../api/dto/comments.input-dto"
import { RawCommentData } from "./dto/comment.raw-dto"

export class CommentatorInfo {
    userId: string
    userLogin: string
}

export class Comment {
    public id: string
    private content: string
    private commentatorInfo: CommentatorInfo
    private postId: string
    private createdAt: Date
    private deletedAt: Date

    constructor(dto: RawCommentData) {
        this.id = dto.id
        this.content = dto.content
        this.commentatorInfo = {
            userId: dto.userId,
            userLogin: dto.userLogin
        }
        this.postId = dto.postId
        this.createdAt = dto.createdAt
    }

    getPersistenceData() {
        return {
            content: this.content,
            commentatorInfo: this.commentatorInfo,
            postId: this.postId,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt
        }
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }

    update(dto: UpdateCommentInputDto) {
        this.content = dto.content
    }
}