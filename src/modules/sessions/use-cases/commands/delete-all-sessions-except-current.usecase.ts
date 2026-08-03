import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SessionInfo } from "../../dto/session-info.dto";
import { SessionsRepository } from "../../infrastructure/sessions.repository";

export class DeleteAllSessionExceptCurrentCommand {
    constructor(
        public readonly session: SessionInfo
    ) { }
}

@CommandHandler(DeleteAllSessionExceptCurrentCommand)
export class DeleteAllSessionExceptCurrentUseCase
    implements ICommandHandler<DeleteAllSessionExceptCurrentCommand> {
    constructor(
        private readonly SessionsRepository: SessionsRepository
    ) { }

    async execute({ session }: DeleteAllSessionExceptCurrentCommand) {

        const userId = session.userId
        const deviceId = session.deviceId

        await this.SessionsRepository.deleteAllUserSessionsExceptCurrent(userId, deviceId)
    }
}