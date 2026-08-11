import { IsEnum } from "class-validator";
import { BaseQueryParams } from "../../../../../core/dto/query.params.input-dto";

enum CommentsSortBy {
    id = 'id',
    content = 'content',
    createdAt = 'createdAt'
}

export class CommentsQueryParams extends BaseQueryParams {
    @IsEnum(CommentsSortBy)
    sortBy = CommentsSortBy.createdAt
}