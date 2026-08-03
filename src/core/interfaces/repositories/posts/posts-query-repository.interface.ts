import { PostsQueryParams } from "../../../../modules/bloggers-platform/posts/api/dto/posts.query.params-dto";
import { PostViewDto } from "../../../../modules/bloggers-platform/posts/api/dto/posts.view-dto";
import { PaginatedViewDto } from "../../../dto/paginated.view-dto";
import { BaseQueryRepository } from "../query-repository.interface";

export interface IPostsQueryRepository extends BaseQueryRepository<PostViewDto, PostsQueryParams> {
    getAllPostsFromBlog(blogId: string, query: PostsQueryParams): Promise<PaginatedViewDto<PostViewDto[]>>
}