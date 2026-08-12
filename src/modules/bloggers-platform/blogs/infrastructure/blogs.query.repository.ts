import { Injectable } from "@nestjs/common";
import { BlogViewDto } from "../api/dto/blogs.view-dto";
import { BlogsQueryParams } from "../api/dto/blogs.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { BaseQueryRepository } from "../../../../core/interfaces/repositories/query-repository.interface";
import { RawBlogData } from "../domain/dto/blog.raw-dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

const BLOG_SORT_COLUMNS = {
    id: 'id',
    name: 'name',
    description: 'description',
    websiteUrl: 'website_url',
    createdAt: 'created_at',
    isMembership: 'is_membership'
}

@Injectable()
export class BlogsQueryRepository implements BaseQueryRepository<BlogViewDto, BlogsQueryParams> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async getEntityById(id: string): Promise<BlogViewDto | null> {
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

        return new BlogViewDto(rawblogData)
    }

    async getAllEntities(query: BlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query

        const skip = query.calculateSkip()

        const { whereSql, parameters } =
            this.buildWhereClause(query)

        const sortColumn =
            BLOG_SORT_COLUMNS[sortBy] ??
            BLOG_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const limitParameterPosition =
            parameters.length + 1

        const offsetParameterPosition =
            parameters.length + 2

        const blogs = await this.dataSource.query(
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
                ${whereSql}
                ORDER BY
                    ${sortColumn} ${sqlSortDirection},
                    id ASC
                LIMIT $${limitParameterPosition}
                OFFSET $${offsetParameterPosition}
            `,
            [
                ...parameters,
                pageSize,
                skip,
            ],
        )

        const countResult =
            await this.dataSource.query(
                `
                    SELECT
                        COUNT(*) AS "totalCount"
                    FROM blogs
                    ${whereSql}
                `,
                parameters,
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        return PaginatedViewDto.mapToView({
            items: blogs.map(row => {
                const blogData = RawBlogData.createFromSqlRow(row)

                return new BlogViewDto(blogData)
            }),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }

    private buildWhereClause(query: BlogsQueryParams) {
        const conditions = [
            'deleted_at IS NULL',
        ]

        const parameters = []
        const searchConditions = []

        if (query.searchNameTerm) {
            parameters.push(query.searchNameTerm)

            searchConditions.push(`
                    name ILIKE
                    '%' || $${parameters.length} || '%'
                `)
        }

        if (searchConditions.length > 0) {
            conditions.push(
                `(${searchConditions.join(' OR ')})`,
            )
        }

        return {
            whereSql: `WHERE ${conditions.join(' AND ')}`,
            parameters,
        }
    }


}
