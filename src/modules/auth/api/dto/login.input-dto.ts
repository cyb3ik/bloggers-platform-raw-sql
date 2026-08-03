import { IsNotEmpty, IsString } from "class-validator"
import { Trim } from "../../../../core/decorators/trim.decorator"

export class LoginInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    loginOrEmail: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    password: string
}   