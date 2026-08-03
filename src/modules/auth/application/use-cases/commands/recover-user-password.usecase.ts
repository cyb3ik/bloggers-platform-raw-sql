import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService, CodeType } from "../../auth.service";
import { UsersRepository } from "../../../../users/infrastructure/users.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";


export class RecoverUserPasswordCommand {
    constructor(public readonly email: string) { }
}

@CommandHandler(RecoverUserPasswordCommand)
export class RecoverUserPasswordUseCase
    implements ICommandHandler<RecoverUserPasswordCommand, void> {
    constructor(
        private readonly AuthService: AuthService,
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ email }: RecoverUserPasswordCommand): Promise<void> {

        const user = await this.UsersRepository.findUserByEmail(email)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const userData = user.getPersistenceData()

        if (userData.passwordRecovery) {
            throw new BadRequestException(
                [{
                    message: 'User with this email is recovering password already',
                    field: 'email',
                }]
            )
        }

        await this.AuthService.sendCodeViaEmail(user, { codeType: CodeType.recovery })
    }
}