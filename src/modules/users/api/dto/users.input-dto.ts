import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator"
import { Trim } from "../../../../core/decorators/trim.decorator"

export class CreateUserInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(3, 10)
    @Matches(/^[a-zA-Z0-9_-]*$/)
    login: string

    @IsEmail()
    @Trim()
    @IsNotEmpty()
    email: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(6, 20)
    password: string
}
