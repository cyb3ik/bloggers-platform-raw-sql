import { RawUserData } from '../../domain/dto/user.raw-dto';

export class UserViewDto {
    id: string
    login: string
    email: string
    createdAt: Date

    constructor(data: RawUserData) {
        this.id = data.id
        this.login = data.login
        this.email = data.email
        this.createdAt = data.createdAt
    }
}