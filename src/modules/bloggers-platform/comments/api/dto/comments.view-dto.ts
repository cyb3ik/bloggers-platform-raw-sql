import { LikeStatus } from '../../../likes/dto/like.raw-dto';
import { CommentatorInfo } from '../../domain/comment-domain.entity';
import { RawCommentData } from '../../domain/dto/comment.raw-dto';

export class CommentLikesInfo {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}

export class CommentViewDto {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    likesInfo: CommentLikesInfo

    constructor(data: RawCommentData, likesInfo: CommentLikesInfo) {
        this.id = data.id
        this.content = data.content
        this.commentatorInfo = {
            userId: data.userId,
            userLogin: data.userLogin
        }
        this.createdAt = data.createdAt
        this.likesInfo = {
            likesCount: likesInfo.likesCount,
            dislikesCount: likesInfo.dislikesCount,
            myStatus: likesInfo.myStatus
        }
    }
}