import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserViewDto } from '../api/dto/users.view-dto';
import { UsersQueryParams } from '../api/dto/users.query.params-dto';
import { PaginatedViewDto } from '../../../core/dto/paginated.view-dto';
import { BaseQueryRepository } from '../../../core/interfaces/repositories/query-repository.interface';
import { RawUserData } from '../domain/dto/user.raw-dto';
import { MongoUser, type UserModelType } from '../domain/user-mongoose.entity';

@Injectable()
export class UsersQueryRepository implements BaseQueryRepository<UserViewDto, UsersQueryParams> {
    constructor(@InjectModel(MongoUser.name) private readonly UserModel: UserModelType) { }

    async getEntityById(id: string): Promise<UserViewDto | null> {
        const userDocument = await this.UserModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!userDocument) {
            return null
        }

        const userData = RawUserData.createFromDocument(userDocument)

        return new UserViewDto(userData)
    }

    async getAllEntities(query: UsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }

        if (searchEmailTerm || searchLoginTerm) {
            filter.$or = []
        }

        if (searchLoginTerm) {
            filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
        }

        if (searchEmailTerm) {
            filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
        }

        const result = await this.UserModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.UserModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(userDocument => {
                const userData = RawUserData.createFromDocument(userDocument)

                return new UserViewDto(userData)
            }),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
