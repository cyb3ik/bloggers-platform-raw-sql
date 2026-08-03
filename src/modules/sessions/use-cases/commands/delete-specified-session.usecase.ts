import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SessionInfo } from "../../dto/session-info.dto";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { SessionsRepository } from "../../infrastructure/sessions.repository";

export class DeleteSpecifiedSessionCommand {
    constructor(
        public readonly sessionInfo: SessionInfo,
        public readonly deviceId: string
    ) { }
}

@CommandHandler(DeleteSpecifiedSessionCommand)
export class DeleteSpecifiedSessionUseCase
    implements ICommandHandler<DeleteSpecifiedSessionCommand> {
    constructor(
        private readonly SessionsRepository: SessionsRepository
    ) { }

    async execute({ sessionInfo, deviceId }: DeleteSpecifiedSessionCommand) {

        const userId = sessionInfo.userId

        const session = await this.SessionsRepository.findSessionByDeviceId(deviceId)

        if (!session) {
            throw new NotFoundException('Session was not found')
        }

        const sessionData = session.getPersistenceData()

        if (sessionData.userId !== userId) {
            throw new ForbiddenException()
        }

        await this.SessionsRepository.deleteSpecifiedDeviceSession(userId, deviceId)
    }
}