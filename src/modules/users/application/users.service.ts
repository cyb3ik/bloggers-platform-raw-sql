import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService
    ) { }

    async checkIfUserIsUnique(email: string, login: string): Promise<void> {
        const checkByEmail = await this.UsersRepository.findUserByEmail(email)

        if (checkByEmail) {
            throw new BadRequestException([{
                message: "User with this email already exists!",
                field: "email"
            }])
        }

        const checkByLogin = await this.UsersRepository.findUserByLogin(login)

        if (checkByLogin) {
            throw new BadRequestException([{
                message: "User with this login already exists!",
                field: "login"
            }])
        }
    }

    async generatePasswordHashAndSalt(password: string) {
        const passwordSalt = await this.CryptoService.generateSalt(10)
        const passwordHash = await this.CryptoService.generateHash(password, passwordSalt)

        return { passwordHash: passwordHash, passwordSalt: passwordSalt }
    }

}