import { InjectModel } from '@nestjs/mongoose';
import { MongoUser, UserDocument, type UserModelType } from '../domain/user-mongoose.entity';
import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../../core/interfaces/repositories/users/users-repository.interface';
import { User } from '../domain/user-domain.entity';
import { RawUserData } from '../domain/dto/user.raw-dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@InjectModel(MongoUser.name) private readonly UserModel: UserModelType) { }

    async save(user: User): Promise<void> {
        const data = user.getPersistenceData()

        await this.UserModel.updateOne(
            { _id: user.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<User | null> {
        const userDocument = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new User(userData)
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const userDocument = await this.UserModel.findOne({
            email: email,
            deletedAt: null,
        }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new User(userData)
    }

    async findUserByLogin(login: string): Promise<User | null> {
        const userDocument = await this.UserModel.findOne({
            login: login,
            deletedAt: null,
        }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new User(userData)
    }

    async findUserByConfirmationCode(code: string): Promise<User | null> {
        const userDocument = await this.UserModel.findOne(
            {
                "emailConfirmation.confirmationCode": code,
                deletedAt: null
            }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new User(userData)
    }

    async findUserByRecoveryCode(code: string): Promise<User | null> {
        const userDocument = await this.UserModel.findOne(
            {
                "passwordRecovery.recoveryCode": code,
                deletedAt: null
            }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new User(userData)
    }
}
