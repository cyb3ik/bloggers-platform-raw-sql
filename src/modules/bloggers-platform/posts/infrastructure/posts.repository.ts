import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';
import { Post } from '../domain/post-domain.entity';
import { RawPostData } from '../domain/dto/posts.raw-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepository implements BaseRepository<Post> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async save(post: Post) {
        const data = post.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO posts (
                    id,
                    title,
                    short_description,
                    content,
                    blog_id,
                    created_at,
                    deleted_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                ON CONFLICT (id)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    short_description = EXCLUDED.short_description,
                    content = EXCLUDED.content,
                    blog_id = EXCLUDED.blog_id,
                    created_at = EXCLUDED.created_at,
                    deleted_at = EXCLUDED.deleted_at
            `,
            [
                post.id,
                data.title,
                data.shortDescription,
                data.content,
                data.blogId,
                data.createdAt,
                data.deletedAt
            ]
        )
    }

    async findEntityById(id: string): Promise<Post | null> {
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

        return new Post(postData)
    }
}
