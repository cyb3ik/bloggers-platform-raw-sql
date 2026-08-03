import { RawBlogData } from "../../domain/dto/blog.raw-dto"

export class BlogViewDto {
    id: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
    createdAt: Date

    constructor(data: RawBlogData) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.websiteUrl = data.websiteUrl
        this.isMembership = data.isMembership
        this.createdAt = data.createdAt
    }
}