import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { UserViewDto } from '../api/dto/users.view-dto'
import { UsersQueryParams } from '../api/dto/users.query.params-dto'
import { PaginatedViewDto } from '../../../core/dto/paginated.view-dto'
import { BaseQueryRepository } from '../../../core/interfaces/repositories/query-repository.interface'
import { RawUserData } from '../domain/dto/user.raw-dto'

interface UsersFilterData {
    whereSql: string
    parameters: unknown[]
}

const USER_SORT_COLUMNS = {
    id: 'id',
    login: 'login',
    email: 'email',
    createdAt: 'created_at',
}

@Injectable()
export class UsersQueryRepository
    implements BaseQueryRepository<UserViewDto, UsersQueryParams> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async getEntityById(id: string): Promise<UserViewDto | null> {
        const rows =
            await this.dataSource.query(
                `
                    SELECT
                        id,
                        login,
                        email,
                        created_at
                    FROM users
                    WHERE id = $1
                      AND deleted_at IS NULL
                    LIMIT 1
                `,
                [id],
            )

        const userRow = rows[0]

        if (!userRow) {
            return null
        }

        const data = RawUserData.createFromSqlRow(userRow)

        return new UserViewDto(data)
    }

    async getAllEntities(query: UsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = query

        const skip = query.calculateSkip()

        const { whereSql, parameters } =
            this.buildWhereClause(query)

        const sortColumn =
            USER_SORT_COLUMNS[sortBy] ??
            USER_SORT_COLUMNS.createdAt

        const sqlSortDirection =
            sortDirection === 'asc' ? 'ASC' : 'DESC'

        const limitParameterPosition =
            parameters.length + 1

        const offsetParameterPosition =
            parameters.length + 2

        const users = await this.dataSource.query(
            `
                SELECT
                    id,
                    login,
                    email,
                    created_at
                FROM users
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
                    FROM users
                    ${whereSql}
                `,
                parameters,
            )

        const totalCount = Number(countResult[0]?.totalCount ?? 0)

        return PaginatedViewDto.mapToView({
            items: users.map((user) => {
                const data = RawUserData.createFromSqlRow(user)

                return new UserViewDto(data)
            }),
            page: pageNumber,
            size: pageSize,
            totalCount
        })
    }

    private buildWhereClause(query: UsersQueryParams): UsersFilterData {
        const conditions: string[] = [
            'deleted_at IS NULL',
        ]

        const parameters = []
        const searchConditions = []

        if (query.searchLoginTerm) {
            parameters.push(query.searchLoginTerm)

            searchConditions.push(`
                login ILIKE
                '%' || $${parameters.length} || '%'
            `)
        }

        if (query.searchEmailTerm) {
            parameters.push(query.searchEmailTerm)

            searchConditions.push(`
                email ILIKE
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