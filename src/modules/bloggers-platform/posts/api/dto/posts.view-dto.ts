import { LikeViewDto } from '../../../likes/dto/like-view.dto';
import { LikeStatus } from '../../../likes/dto/like.raw-dto';
import { RawPostData } from '../../domain/dto/posts.raw-dto';

export class ExtendedPostLikesInfo {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeViewDto[]
}

export class PostViewDto {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: ExtendedPostLikesInfo

    constructor(data: RawPostData, likesInfo: ExtendedPostLikesInfo) {
        this.id = data.id
        this.title = data.title
        this.shortDescription = data.shortDescription
        this.content = data.content
        this.blogId = data.blogId
        this.blogName = data.blogName
        this.createdAt = data.createdAt
        this.extendedLikesInfo = {
            likesCount: likesInfo.likesCount,
            dislikesCount: likesInfo.dislikesCount,
            myStatus: likesInfo.myStatus,
            newestLikes: likesInfo.newestLikes
        }
    }
}