import { IsNotEmpty, IsString, Length } from "class-validator";
import { Trim } from "../../../../core/decorators/trim.decorator";

export class NewPasswordInput {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(6, 20)
    newPassword: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    recoveryCode: string
}