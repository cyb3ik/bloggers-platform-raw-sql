import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ILikesQueryRepository } from '../../../../core/interfaces/repositories/likes/likes-query-repository.interface'
import { LikeViewDto } from '../dto/like-view.dto'
import { LikeStatus, RawLikeData } from '../dto/like.raw-dto'
import { ExtendedPostLikesInfo } from '../../posts/api/dto/posts.view-dto'
import { CommentLikesInfo } from '../../comments/api/dto/comments.view-dto'

@Injectable()
export class LikesQueryRepository
    implements ILikesQueryRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async getNewestLikesFromEntity(entityId: string): Promise<LikeViewDto[]> {
        const rows =
            await this.dataSource.query(
                `
                    SELECT
                        l.id,
                        l.entity_id,
                        l.user_id,
                        u.login AS user_login,
                        l.status,
                        l.created_at
                    FROM likes l
                    INNER JOIN users u
                        on u.id = l.user_id
                    WHERE l.entity_id = $1
                    AND status = 'Like'
                    ORDER BY
                        created_at DESC,
                        id DESC
                    LIMIT 3
                `,
                [entityId],
            )

        return rows.map((row) => {
            const likeData =
                RawLikeData.createFromSqlRow(row)

            return new LikeViewDto(likeData)
        })
    }

    async getUserStatus(entityId: string, userId?: string): Promise<LikeStatus> {
        if (!userId) {
            return LikeStatus.None
        }

        const rows =
            await this.dataSource.query(
                `
                    SELECT status
                    FROM likes
                    WHERE entity_id = $1
                      AND user_id = $2
                    LIMIT 1
                `,
                [
                    entityId,
                    userId,
                ],
            )

        if (!rows[0]) {
            return LikeStatus.None
        }

        return rows[0].status
    }

    async getLikesAndDislikesCount(entityId: string): Promise<{
        likesCount: number
        dislikesCount: number
    }> {
        const rows =
            await this.dataSource.query(
                `
                    SELECT
                        COUNT(*) FILTER (
                            WHERE status = 'Like'
                        )::int AS "likesCount",

                        COUNT(*) FILTER (
                            WHERE status = 'Dislike'
                        )::int AS "dislikesCount"

                    FROM likes
                    WHERE entity_id = $1
                `,
                [entityId],
            )

        return {
            likesCount: rows[0]?.likesCount ?? 0,
            dislikesCount: rows[0]?.dislikesCount ?? 0,
        }
    }

    async getPostLikesInfo(entityId: string, userId?: string): Promise<ExtendedPostLikesInfo> {
        const [
            counts,
            myStatus,
            newestLikes,
        ] = await Promise.all([
            this.getLikesAndDislikesCount(entityId),
            this.getUserStatus(entityId, userId),
            this.getNewestLikesFromEntity(entityId),
        ])

        return {
            likesCount: counts.likesCount,
            dislikesCount: counts.dislikesCount,
            myStatus,
            newestLikes,
        }
    }

    async getCommentLikesInfo(entityId: string, userId?: string): Promise<CommentLikesInfo> {
        const [
            counts,
            myStatus,
        ] = await Promise.all([
            this.getLikesAndDislikesCount(entityId),
            this.getUserStatus(entityId, userId),
        ])

        return {
            likesCount: counts.likesCount,
            dislikesCount: counts.dislikesCount,
            myStatus,
        }
    }
}