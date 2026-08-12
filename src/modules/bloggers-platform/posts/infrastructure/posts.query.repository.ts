import { Injectable } from "@nestjs/common";
import { PostsQueryParams } from "../api/dto/posts.query.params-dto";
import { IPostsQueryRepository } from "../../../../core/interfaces/repositories/posts/posts-query-repository.interface";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { PostViewDto } from "../api/dto/posts.view-dto";
import { RawPostData } from "../domain/dto/posts.raw-dto";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";


const POST_SORT_COLUMNS = {
    id: 'p.id',
    title: 'p.title',
    shortDescription: 'p.short_description',
    content: 'p.content',
    blogName: 'blog_name',
    createdAt: 'p.created_at',
}

@Injectable()
export class PostsQueryRepository implements IPostsQueryRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly LikesQueryRepository: LikesQueryRepository
    ) { }

    async getEntityById(id: string, userId?: string): Promise<PostViewDto | null> {
        const rows = await this.dataSource.query(
            `
                SELECT
                    p.id,
                    p.title,
                    p.short_description,
                    p.content,
                    p.blog_id,
                    b.name AS blog_name,
                    p.created_at,
                    p.deleted_at
                FROM posts p
                INNER JOIN blogs b
                    ON b.id = p.blog_id

                WHERE p.deleted_at IS NULL
                AND p.id = $1
                LIMIT 1
            `,
            [id]
        )

        const row = rows[0]

        if (!row) {
            return null
        }

        const postData = RawPostData.createFromSqlRow(row)

        const likesInfo = await this.LikesQueryRepository.getPostLikesInfo(id, userId)

        return new PostViewDto(postData, likesInfo)
    }

    async getAllEntities(query: PostsQueryParams, userId?: string) {

        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const sortColumn =
            POST_SORT_COLUMNS[sortBy] ??
            POST_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const posts = await this.dataSource.query(
            `
                SELECT
                    p.id,
                    p.title,
                    p.short_description,
                    p.content,
                    p.blog_id,
                    b.name AS blog_name,
                    p.created_at,
                    p.deleted_at
                FROM posts p
                INNER JOIN blogs b
                    ON b.id = p.blog_id

                WHERE p.deleted_at IS NULL
                ORDER BY
                    ${sortColumn} ${sqlSortDirection},
                    id ASC
                LIMIT $1
                OFFSET $2
            `,
            [
                pageSize,
                skip,
            ],
        )

        const countResult =
            await this.dataSource.query(
                `
                    SELECT
                        COUNT(*) AS "totalCount"
                    FROM posts
                    WHERE deleted_at IS NULL
                `
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        const mappedResult = []

        for (const item of posts) {
            const postData = RawPostData.createFromSqlRow(item)

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

        const sortColumn =
            POST_SORT_COLUMNS[sortBy] ??
            POST_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const posts = await this.dataSource.query(
            `
                SELECT
                    p.id,
                    p.title,
                    p.short_description,
                    p.content,
                    p.blog_id,
                    b.name AS blog_name,
                    p.created_at,
                    p.deleted_at
                FROM posts p
                INNER JOIN blogs b
                    ON b.id = p.blog_id

                WHERE p.deleted_at IS NULL
                AND p.blog_id = $1
                ORDER BY
                    ${sortColumn} ${sqlSortDirection},
                    id ASC
                LIMIT $2
                OFFSET $3
            `,
            [
                blogId,
                pageSize,
                skip,
            ],
        )

        const countResult =
            await this.dataSource.query(
                `
                    SELECT
                        COUNT(*) AS "totalCount"
                    FROM posts
                    WHERE deleted_at IS NULL
                    AND blog_id = $1
                `,
                [blogId]
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        const mappedResult = []

        for (const item of posts) {
            const postData = RawPostData.createFromSqlRow(item)

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
