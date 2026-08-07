import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { ISessionsRepository } from '../../../core/interfaces/repositories/sessions/sessions-repository.interface'
import { Session } from '../domain/session-domain.entity'
import { RawSessionData } from '../dto/session.raw-dto'

const SESSION_SELECT = `
    SELECT
        id,
        ip,
        title,
        last_active_date,
        device_id,
        user_id,
        exp
    FROM sessions
`

@Injectable()
export class SessionsRepository
    implements ISessionsRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async save(session: Session): Promise<void> {
        const data = session.getPersistenceData()

        await this.dataSource.query(
            `
                INSERT INTO sessions (
                    id,
                    ip,
                    title,
                    last_active_date,
                    device_id,
                    user_id,
                    exp
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
                    ip = EXCLUDED.ip,
                    title = EXCLUDED.title,
                    last_active_date = EXCLUDED.last_active_date,
                    device_id = EXCLUDED.device_id,
                    user_id = EXCLUDED.user_id,
                    exp = EXCLUDED.exp
            `,
            [
                session.id,
                data.ip,
                data.title,
                data.lastActiveDate,
                data.deviceId,
                data.userId,
                data.exp,
            ],
        )
    }

    async findEntityById(
        id: string,
    ): Promise<Session | null> {
        const rows =
            await this.dataSource.query(
                `
                    ${SESSION_SELECT}
                    WHERE id = $1
                    LIMIT 1
                `,
                [id],
            )

        const data = RawSessionData.createFromSqlRow(rows[0])

        return new Session(data)
    }

    async findSessionByDeviceId(
        deviceId: string,
    ): Promise<Session | null> {
        const rows =
            await this.dataSource.query(
                `
                    ${SESSION_SELECT}
                    WHERE device_id = $1
                    LIMIT 1
                `,
                [deviceId],
            )

        const data = RawSessionData.createFromSqlRow(rows[0])

        return new Session(data)
    }

    async findSessionByDeviceAndUserId(
        userId: string,
        deviceId: string,
    ): Promise<Session | null> {
        const rows =
            await this.dataSource.query(
                `
                    ${SESSION_SELECT}
                    WHERE user_id = $1
                      AND device_id = $2
                    LIMIT 1
                `,
                [
                    userId,
                    deviceId,
                ],
            )

        const data = RawSessionData.createFromSqlRow(rows[0])

        return new Session(data)
    }

    async findSession(
        userId: string,
        deviceId: string,
        iat: number,
    ): Promise<Session | null> {
        const rows =
            await this.dataSource.query(
                `
                    ${SESSION_SELECT}
                    WHERE user_id = $1
                      AND device_id = $2
                      AND last_active_date = $3
                    LIMIT 1
                `,
                [
                    userId,
                    deviceId,
                    iat,
                ],
            )

        const data = RawSessionData.createFromSqlRow(rows[0])

        return new Session(data)
    }

    async deleteSpecifiedDeviceSession(
        userId: string,
        deviceId: string,
    ): Promise<void> {
        await this.dataSource.query(
            `
                DELETE FROM sessions
                WHERE user_id = $1
                  AND device_id = $2
            `,
            [
                userId,
                deviceId,
            ],
        )
    }

    async deleteAllUserSessionsExceptCurrent(
        userId: string,
        deviceId: string,
    ): Promise<void> {
        await this.dataSource.query(
            `
                DELETE FROM sessions
                WHERE user_id = $1
                  AND device_id <> $2
            `,
            [
                userId,
                deviceId,
            ],
        )
    }
}