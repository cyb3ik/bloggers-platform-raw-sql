import { Injectable } from "@nestjs/common";
import { CommentViewDto } from "../api/dto/comments.view-dto";
import { CommentsQueryParams } from "../api/dto/comments.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { ICommentsQueryRepository } from "../../../../core/interfaces/repositories/comments/commets-query-repository.interface";
import { LikesQueryRepository } from "../../likes/repositories/likes.query.repository";
import { RawCommentData } from "../domain/dto/comment.raw-dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

const COMMENT_SORT_COLUMNS = {
    id: 'c.id',
    content: 'c.content',
    userLogin: 'user_login',
    createdAt: 'c.created_at'
}

@Injectable()
export class CommentsQueryRepository implements ICommentsQueryRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly LikesQueryRepository: LikesQueryRepository
    ) { }

    async getEntityById(id: string, userId?: string): Promise<CommentViewDto | null> {
        const rows = await this.dataSource.query(
            `
                SELECT
                    c.id,
                    c.post_id,
                    c.content,
                    c.commentator_id,
                    u.login AS user_login,
                    c.created_at,
                    c.deleted_at
                FROM comments c
                INNER JOIN users u
                    ON u.id = c.commentator_id
                WHERE c.deleted_at IS NULL
                AND c.id = $1
                LIMIT 1
            `,
            [id]
        )

        const row = rows[0]

        if (!row) {
            return null
        }

        const commentData = RawCommentData.createFromSqlRow(row)

        const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(id, userId)

        return new CommentViewDto(commentData, likesInfo)
    }

    async getAllEntities(query: CommentsQueryParams, userId?: string): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const sortColumn =
            COMMENT_SORT_COLUMNS[sortBy] ??
            COMMENT_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const comments = await this.dataSource.query(
            `
                SELECT
                    c.id,
                    c.post_id,
                    c.content,
                    c.commentator_id,
                    u.login AS user_login,
                    c.created_at,
                    c.deleted_at
                FROM comments c
                INNER JOIN users u
                    ON u.id = c.commentator_id

                WHERE c.deleted_at IS NULL
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
                    FROM comments
                    WHERE deleted_at IS NULL
                `
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        const mappedResult = []

        for (const item of comments) {
            const commentData = RawCommentData.createFromSqlRow(item)

            const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(item.id, userId)

            mappedResult.push(new CommentViewDto(commentData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    async getAllCommentsFromPost(postId: string, query: CommentsQueryParams, userId?: string): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const { pageSize, sortBy, sortDirection, pageNumber } = query

        const skip = query.calculateSkip()

        const sortColumn =
            COMMENT_SORT_COLUMNS[sortBy] ??
            COMMENT_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const comments = await this.dataSource.query(
            `
                SELECT
                    c.id,
                    c.post_id,
                    c.content,
                    c.commentator_id,
                    u.login AS user_login,
                    c.created_at,
                    c.deleted_at
                FROM comments c
                INNER JOIN users u
                    ON u.id = c.commentator_id

                WHERE c.deleted_at IS NULL
                AND c.post_id = $1
                ORDER BY
                    ${sortColumn} ${sqlSortDirection},
                    id ASC
                LIMIT $2
                OFFSET $3
            `,
            [
                postId,
                pageSize,
                skip,
            ],
        )

        const countResult =
            await this.dataSource.query(
                `
                    SELECT
                        COUNT(*) AS "totalCount"
                    FROM comments
                    WHERE deleted_at IS NULL
                    AND post_id = $1
                `,
                [postId]
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        const mappedResult = []

        for (const item of comments) {
            const commentData = RawCommentData.createFromSqlRow(item)

            const likesInfo = await this.LikesQueryRepository.getCommentLikesInfo(item.id, userId)

            mappedResult.push(new CommentViewDto(commentData, likesInfo))
        }

        return PaginatedViewDto.mapToView({
            items: mappedResult,
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}