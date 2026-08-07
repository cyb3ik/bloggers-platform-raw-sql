import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { IUsersRepository } from '../../../core/interfaces/repositories/users/users-repository.interface'
import { User } from '../domain/user-domain.entity'
import { RawUserData } from '../domain/dto/user.raw-dto'

const USER_SELECT = `
    SELECT
        id,
        login,
        email,
        password_hash,
        password_salt,
        created_at,
        deleted_at,
        email_confirmation_code,
        email_confirmation_expires_at,
        is_confirmed,
        password_recovery_code,
        password_recovery_expires_at
    FROM users
`

const userLookupColumns = {
    id: 'id',
    email: 'email',
    login: 'login',
    confirmationCode: 'email_confirmation_code',
    recoveryCode: 'password_recovery_code',
} as const

type UserLookupField = keyof typeof userLookupColumns

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async save(user: User): Promise<void> {
        const data = user.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO users (
                    id,
                    login,
                    email,
                    password_hash,
                    password_salt,
                    created_at,
                    deleted_at,
                    email_confirmation_code,
                    email_confirmation_expires_at,
                    is_confirmed,
                    password_recovery_code,
                    password_recovery_expires_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12
                )
                ON CONFLICT (id)
                DO UPDATE SET
                    login = EXCLUDED.login,
                    email = EXCLUDED.email,
                    password_hash = EXCLUDED.password_hash,
                    password_salt = EXCLUDED.password_salt,
                    created_at = EXCLUDED.created_at,
                    deleted_at = EXCLUDED.deleted_at,
                    email_confirmation_code =
                        EXCLUDED.email_confirmation_code,
                    email_confirmation_expires_at =
                        EXCLUDED.email_confirmation_expires_at,
                    is_confirmed =
                        EXCLUDED.is_confirmed,
                    password_recovery_code =
                        EXCLUDED.password_recovery_code,
                    password_recovery_expires_at =
                        EXCLUDED.password_recovery_expires_at
            `,
            [
                user.id,
                data.login,
                data.email,
                data.passwordHash,
                data.passwordSalt,
                data.createdAt,
                data.deletedAt ?? null,

                data.emailConfirmation?.confirmationCode ?? null,
                data.emailConfirmation?.expirationDate ?? null,
                data.emailConfirmation?.isConfirmed ?? false,

                data.passwordRecovery?.recoveryCode ?? null,
                data.passwordRecovery?.expirationDate ?? null,
            ],
        )
    }

    async findEntityById(id: string): Promise<User | null> {
        return this.findOneBy('id', id)
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.findOneBy('email', email)
    }

    async findUserByLogin(login: string): Promise<User | null> {
        return this.findOneBy('login', login)
    }

    async findUserByConfirmationCode(code: string): Promise<User | null> {
        return this.findOneBy('confirmationCode', code)
    }

    async findUserByRecoveryCode(code: string): Promise<User | null> {
        return this.findOneBy('recoveryCode', code)
    }

    private async findOneBy(field: UserLookupField, value: string): Promise<User | null> {
        const column = userLookupColumns[field]

        const rows = await this.dataSource.query(
            `
                ${USER_SELECT}
                WHERE ${column} = $1
                  AND deleted_at IS NULL
                LIMIT 1
            `,
            [value],
        )

        const row = rows[0]

        if (!row) {
            return null
        }

        const rawUserData = RawUserData.createFromSqlRow(row)

        return new User(rawUserData)
    }
}