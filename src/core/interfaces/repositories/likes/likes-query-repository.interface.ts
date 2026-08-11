import { CommentLikesInfo } from "../../../../modules/bloggers-platform/comments/api/dto/comments.view-dto"
import { ExtendedPostLikesInfo } from "../../../../modules/bloggers-platform/posts/api/dto/posts.view-dto"

export interface ILikesQueryRepository {
    getPostLikesInfo(entityId: string, userId?: string): Promise<ExtendedPostLikesInfo>
    getCommentLikesInfo(entityId: string, userId?: string): Promise<CommentLikesInfo>
}
