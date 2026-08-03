import { CommentsQueryParams } from "../../../../modules/bloggers-platform/comments/api/dto/comments.query.params-dto";
import { CommentViewDto } from "../../../../modules/bloggers-platform/comments/api/dto/comments.view-dto";
import { PaginatedViewDto } from "../../../dto/paginated.view-dto";
import { BaseQueryRepository } from "../query-repository.interface";

export interface ICommentsQueryRepository extends BaseQueryRepository<CommentViewDto, CommentsQueryParams> {
    getAllCommentsFromPost(postId: string, query: CommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>>
}