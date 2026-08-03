import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseQueryParams } from "../../../../core/dto/query.params.input-dto";

enum UsersSortBy {
    id = 'id',
    login = 'login',
    email = 'email',
    createdAt = 'createdAt'
}

export class UsersQueryParams extends BaseQueryParams {
    @IsEnum(UsersSortBy)
    sortBy = UsersSortBy.createdAt

    @IsString()
    @IsOptional()
    searchLoginTerm: string | null = null

    @IsString()
    @IsOptional()
    searchEmailTerm: string | null = null
}