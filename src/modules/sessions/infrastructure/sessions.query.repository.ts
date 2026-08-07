import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { SessionViewDto } from '../dto/session.view-dto'
import { RawSessionData } from '../dto/session.raw-dto'
import { ISessionQueryRepository } from '../../../core/interfaces/repositories/sessions/sessions-query-repository.interface'

@Injectable()
export class SessionsQueryRepository
    implements ISessionQueryRepository {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async getAllUserSessions(
        userId: string,
    ): Promise<SessionViewDto[]> {
        const rows =
            await this.dataSource.query(
                `
                    SELECT
                        id,
                        ip,
                        title,
                        last_active_date,
                        device_id,
                        user_id,
                        exp
                    FROM sessions
                    WHERE user_id = $1
                `,
                [userId],
            )

        return rows.map((row) => {
            const sessionData =
                RawSessionData.createFromSqlRow(row)

            return new SessionViewDto(sessionData)
        })
    }
}