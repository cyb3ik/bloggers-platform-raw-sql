import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../../infrastructure/users.repository";
import { NotFoundException } from "@nestjs/common";


export class DeleteUserCommand {
    constructor(public readonly userId: string) { }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
    implements ICommandHandler<DeleteUserCommand> {
    constructor(
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ userId }: DeleteUserCommand): Promise<void> {

        const user = await this.UsersRepository.findEntityById(userId)

        if (!user) {
            //TODO: replace with domain exception
            throw new NotFoundException('User not found')
        }

        user.softDeleteSelf()

        await this.UsersRepository.save(user)

        return
    }
}