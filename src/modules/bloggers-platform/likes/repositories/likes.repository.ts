import { Injectable } from "@nestjs/common"
import { ILikesRepository } from "../../../../core/interfaces/repositories/likes/likes-repository.interface"
import { Like } from "../domain/like-domain.entity"
import { RawLikeData } from "../dto/like.raw-dto"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

@Injectable()
export class LikesRepository implements ILikesRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async save(like: Like) {
        const data = like.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO likes (
                    id,
                    user_id,
                    entity_id,
                    status,
                    created_at,
                    deleted_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                ON CONFLICT (id)
                DO UPDATE SET
                    user_id = EXCLUDED.user_id,
                    entity_id = EXCLUDED.entity_id,
                    status = EXCLUDED.status,
                    created_at = EXCLUDED.created_at,
                    deleted_at = EXCLUDED.deleted_at
            `,
            [
                like.id,
                data.userId,
                data.entityId,
                data.status,
                data.createdAt,
                data.deletedAt
            ]
        )
    }

    async findLikeByUserId(entityId: string, userId: string) {
        const rows = await this.dataSource.query(
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
                    WHERE entity_id = $1
                    AND user_id = $2
                    ORDER BY
                        created_at DESC,
                        id DESC
                    LIMIT 3
                `,
            [
                entityId,
                userId
            ],
        )

        const row = rows[0]

        if (!row) {
            return null
        }

        const likeData = RawLikeData.createFromSqlRow(row)

        return new Like(likeData)
    }
}