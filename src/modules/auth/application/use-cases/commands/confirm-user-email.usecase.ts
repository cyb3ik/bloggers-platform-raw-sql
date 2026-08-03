import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService, CodeType } from "../../auth.service";
import { UsersRepository } from "../../../../users/infrastructure/users.repository";
import { NotFoundException } from "@nestjs/common";


export class ConfirmUserEmailCommand {
    constructor(public readonly code: string) { }
}

@CommandHandler(ConfirmUserEmailCommand)
export class ConfirmUserEmailUseCase
    implements ICommandHandler<ConfirmUserEmailCommand, void> {
    constructor(
        private readonly AuthService: AuthService,
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ code }: ConfirmUserEmailCommand): Promise<void> {

        const user = await this.UsersRepository.findUserByConfirmationCode(code)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        await this.AuthService.checkIfCodeIsValid(user, code, { codeType: CodeType.emailConfirmation })
    }
}