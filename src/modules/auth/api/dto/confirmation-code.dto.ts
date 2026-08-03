import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Trim } from "../../../../core/decorators/trim.decorator";

export class ConfirmationCode {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsUUID()
    code: string
}