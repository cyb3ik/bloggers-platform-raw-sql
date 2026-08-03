import { UpdateBlogInputDto } from "../api/dto/blogs.input-dto"
import { RawBlogData } from "./dto/blog.raw-dto"

export class Blog {
    public id: string
    private name: string
    private description: string
    private websiteUrl: string
    private isMembership: boolean
    private createdAt: Date
    private deletedAt: Date | null = null

    constructor(dto: RawBlogData) {
        this.id = dto.id
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
        this.isMembership = dto.isMembership
        this.createdAt = dto.createdAt
    }

    getPersistenceData() {
        return {
            name: this.name,
            description: this.description,
            websiteUrl: this.websiteUrl,
            isMembership: this.isMembership,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt
        }
    }

    softDeleteSelf() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted')
        }
        this.deletedAt = new Date()
    }

    update(dto: UpdateBlogInputDto): void {
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
    }

}