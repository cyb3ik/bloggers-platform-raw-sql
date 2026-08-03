import { IsMongoId, IsNotEmpty, IsString, IsUUID, Length } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim.decorator"

export class CreatePostForBlogInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 30)
    title: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 100)
    shortDescription: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 1000)
    content: string
}

export class CreatePostInputDto extends CreatePostForBlogInputDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    blogId: string
}

export class UpdatePostInputDto extends CreatePostInputDto { }