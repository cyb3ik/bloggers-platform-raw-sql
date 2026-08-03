import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService, CodeType } from "../../auth.service";
import { UsersRepository } from "../../../../users/infrastructure/users.repository";
import { BadRequestException } from "@nestjs/common";


export class ResendConfirmationCodeCommand {
    constructor(public readonly email: string) { }
}

@CommandHandler(ResendConfirmationCodeCommand)
export class ResendConfirmationCodeUseCase
    implements ICommandHandler<ResendConfirmationCodeCommand, void> {
    constructor(
        private readonly AuthService: AuthService,
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ email }: ResendConfirmationCodeCommand): Promise<void> {

        const user = await this.UsersRepository.findUserByEmail(email)

        const userData = user.getPersistenceData()

        if (!user || userData.emailConfirmation.isConfirmed) {
            throw new BadRequestException(
                [{
                    message: 'Email already confirmed',
                    field: 'email',
                }]
            )
        }

        this.AuthService.sendCodeViaEmail(user, { codeType: CodeType.emailConfirmation }).catch(e => console.log(e))
    }
}