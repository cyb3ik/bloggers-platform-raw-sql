import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';
import { Blog } from '../domain/blog-domain.entity';
import { RawBlogData } from '../domain/dto/blog.raw-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository implements BaseRepository<Blog> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async save(blog: Blog) {
        const data = blog.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO blogs (
                    id,
                    name,
                    description,
                    website_url,
                    is_membership,
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
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    website_url = EXCLUDED.website_url,
                    is_membership = EXCLUDED.is_membership,
                    created_at = EXCLUDED.created_at,
                    deleted_at = EXCLUDED.deleted_at
            `,
            [
                blog.id,
                data.name,
                data.description,
                data.websiteUrl,
                data.isMembership,
                data.createdAt,
                data.deletedAt
            ]
        )
    }

    async findEntityById(id: string): Promise<Blog | null> {
        const rows = await this.dataSource.query(
            `
            SELECT
                id,
                name,
                description,
                website_url,
                is_membership,
                created_at,
                deleted_at
            FROM blogs
            WHERE id = $1
            AND deleted_at IS NULL
            LIMIT 1
            `,
            [id]
        )

        const row = rows[0]

        if (!row) {
            return null
        }

        const rawblogData = RawBlogData.createFromSqlRow(row)

        return new Blog(rawblogData)
    }
}
