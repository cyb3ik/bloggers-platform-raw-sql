import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../../core/interfaces/repositories/base-repository.interface";
import { Comment } from "../domain/comment-domain.entity";
import { RawCommentData } from "../domain/dto/comment.raw-dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class CommentsRepository implements BaseRepository<Comment> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async save(comment: Comment) {
        const data = comment.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO comments (
                    id,
                    post_id,
                    content,
                    commentator_id,
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
                    post_id = EXCLUDED.post_id,
                    content = EXCLUDED.content,
                    commentator_id = EXCLUDED.commentator_id,
                    created_at = EXCLUDED.created_at,
                    deleted_at = EXCLUDED.deleted_at
            `,
            [
                comment.id,
                data.postId,
                data.content,
                data.commentatorInfo.userId,
                data.createdAt,
                data.deletedAt
            ]
        )
    }

    async findEntityById(id: string): Promise<Comment | null> {
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

        return new Comment(commentData)
    }
}