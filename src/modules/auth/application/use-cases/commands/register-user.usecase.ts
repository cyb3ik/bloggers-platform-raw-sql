import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService, CodeType } from "../../auth.service";
import { CreateUserInputDto } from "../../../../users/api/dto/users.input-dto";
import { UsersRepository } from "../../../../users/infrastructure/users.repository";
import { CreateUserCommand } from "../../../../users/application/use-cases/commands/create-user.usecase";
import { Types } from "mongoose";


export class RegisterUserCommand {
    constructor(public readonly dto: CreateUserInputDto) { }
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
    implements ICommandHandler<RegisterUserCommand, void> {
    constructor(
        private readonly AuthService: AuthService,
        private readonly UsersRepository: UsersRepository,
        private readonly CommandBus: CommandBus,
    ) { }

    async execute({ dto }: RegisterUserCommand): Promise<void> {

        const userId = await this.CommandBus.execute(new CreateUserCommand(dto))

        const user = await this.UsersRepository.findEntityById(userId)

        this.AuthService.sendCodeViaEmail(user, { codeType: CodeType.emailConfirmation }).catch(e => console.log(e))
    }
}