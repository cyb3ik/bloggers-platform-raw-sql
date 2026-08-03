import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../../../core/decorators/trim.decorator";
import { LikeStatus } from "./like.raw-dto";

export class ChangeLikeStatusInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsEnum(LikeStatus)
    likeStatus: LikeStatus
}