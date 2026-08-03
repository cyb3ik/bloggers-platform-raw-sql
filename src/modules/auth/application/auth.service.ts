import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { BcryptService } from "../../users/application/bcrypt.service";
import { MailService } from "./mail.service";
import { randomUUID } from "crypto";
import { LoginInputDto } from "../api/dto/login.input-dto";
import { MePageView } from "../api/dto/view/me-page-view.dto";
import { User } from "../../users/domain/user-domain.entity";

export enum CodeType {
    emailConfirmation = "emailConfimation",
    recovery = "recovery"
}

@Injectable()
export class AuthService {
    constructor(
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService,
        private readonly MailService: MailService
    ) { }

    async checkCredentials(dto: LoginInputDto) {
        const userByLogin = await this.UsersRepository.findUserByLogin(dto.loginOrEmail)

        const userByEmail = await this.UsersRepository.findUserByEmail(dto.loginOrEmail)

        if (!userByLogin && !userByEmail) {
            throw new UnauthorizedException()
        }

        const user = userByEmail || userByLogin

        const userData = user.getPersistenceData()

        if (userData.passwordHash !== await this.CryptoService.generateHash(dto.password, userData.passwordSalt)) {
            throw new UnauthorizedException()
        }

        return user
    }

    async sendCodeViaEmail(user: User, options: { codeType: CodeType }) {
        const code = randomUUID().toString()

        const userData = user.getPersistenceData()

        switch (options.codeType) {
            case (CodeType.emailConfirmation):
                user.setEmailConfirmationCode(code)
                await this.MailService.sendEmail(userData.email, code)
                break
            case (CodeType.recovery):
                user.setPasswordRecoveryCode(code)
                await this.MailService.sendRecoveryCode(userData.email, code)
                break
        }

        await this.UsersRepository.save(user)

        return code
    }

    async checkIfCodeIsValid(user: User, code: string, options: { codeType: CodeType }) {
        const userData = user.getPersistenceData()

        switch (options.codeType) {
            case (CodeType.emailConfirmation):
                if (code !== userData.emailConfirmation.confirmationCode) {
                    throw new BadRequestException(
                        [{
                            message: 'Code is wrong',
                            field: 'code',
                        }]
                    )
                }

                if (userData.emailConfirmation.expirationDate < new Date()) {
                    throw new BadRequestException(
                        [{
                            message: 'Code has expired',
                            field: 'code',
                        }]
                    )
                }

                if (userData.emailConfirmation.isConfirmed) {
                    throw new BadRequestException(
                        [{
                            message: 'Email already confirmed',
                            field: 'code',
                        }]
                    )
                }

                user.setEmailConfirmationStatus(true)

                break

            case (CodeType.recovery):
                if (code !== userData.passwordRecovery.recoveryCode) {
                    throw new BadRequestException(
                        {
                            message: 'Code is wrong',
                            field: 'code',
                        }
                    )
                }

                if (userData.passwordRecovery.expirationDate < new Date()) {
                    throw new BadRequestException({
                        message: 'Code has expired',
                        field: 'code',
                    })
                }

                break
        }

        await this.UsersRepository.save(user)
    }

    async getMePage(id: string) {
        const user = await this.UsersRepository.findEntityById(id)

        return new MePageView(user)
    }

}