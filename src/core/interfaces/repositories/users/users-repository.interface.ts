import { User } from "../../../../modules/users/domain/user-domain.entity";
import { BaseRepository } from "../base-repository.interface";

export interface IUsersRepository extends BaseRepository<User> {
    findUserByEmail(email: string): Promise<User | null>

    findUserByLogin(login: string): Promise<User | null>

    findUserByConfirmationCode(code: string): Promise<User | null>

    findUserByRecoveryCode(code: string): Promise<User | null>
}