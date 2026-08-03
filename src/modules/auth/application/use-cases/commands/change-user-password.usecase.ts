import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService, CodeType } from "../../auth.service";
import { UsersRepository } from "../../../../users/infrastructure/users.repository";
import { NewPasswordInput } from "../../../api/dto/new-password.input-dto";
import { UsersService } from "../../../../users/application/users.service";


export class ChangeUserPasswordCommand {
    constructor(public readonly dto: NewPasswordInput) { }
}

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordUseCase
    implements ICommandHandler<ChangeUserPasswordCommand, void> {
    constructor(
        private readonly AuthService: AuthService,
        private readonly UsersService: UsersService,
        private readonly UsersRepository: UsersRepository,
    ) { }

    async execute({ dto }: ChangeUserPasswordCommand): Promise<void> {

        const user = await this.UsersRepository.findUserByRecoveryCode(dto.recoveryCode)

        await this.AuthService.checkIfCodeIsValid(user, dto.recoveryCode, { codeType: CodeType.recovery })

        const newPasswordInfo = await this.UsersService.generatePasswordHashAndSalt(dto.newPassword)

        user.updatePassword(newPasswordInfo)

        await this.UsersRepository.save(user)
    }
}