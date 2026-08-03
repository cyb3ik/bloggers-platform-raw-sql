import { Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    generateSalt(rounds: number) {
        return bcrypt.genSalt(rounds)
    }

    generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    }
}