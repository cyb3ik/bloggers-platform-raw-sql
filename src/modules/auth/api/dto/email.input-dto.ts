import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../../../core/decorators/trim.decorator";

export class EmailInput {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsEmail()
    email: string
}