import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim.decorator"

export class CreateBlogInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 15)
    name: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 500)
    description: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 100)
    @IsUrl()
    websiteUrl: string
}

export class UpdateBlogInputDto extends CreateBlogInputDto { }
