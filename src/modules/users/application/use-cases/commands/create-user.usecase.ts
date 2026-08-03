import { CreateUserInputDto } from "../../../api/dto/users.input-dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersService } from "../../users.service";
import { UsersRepository } from "../../../infrastructure/users.repository";
import { UsersConfig } from "../../../users.config";
import { User } from "../../../domain/user-domain.entity";
import { randomUUID } from "crypto";


export class CreateUserCommand {
    constructor(public readonly dto: CreateUserInputDto) { }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
    implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly UsersService: UsersService,
        private readonly UsersRepository: UsersRepository,
        private readonly UsersConfig: UsersConfig
    ) { }

    async execute({ dto }: CreateUserCommand): Promise<string> {

        await this.UsersService.checkIfUserIsUnique(dto.email, dto.login)

        const passwordInfo = await this.UsersService.generatePasswordHashAndSalt(dto.password)

        const userDomainDto = {
            id: randomUUID().toString(),
            email: dto.email,
            login: dto.login,
            passwordSalt: passwordInfo.passwordSalt,
            passwordHash: passwordInfo.passwordHash,
            isConfirmed: this.UsersConfig.isUserAutoConfirmed,
            createdAt: new Date()
        }

        const user = new User(userDomainDto)

        await this.UsersRepository.save(user)

        return user.id
    }
}