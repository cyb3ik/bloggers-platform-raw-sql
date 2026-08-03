import { UpdatePostInputDto } from "../api/dto/posts.input-dto"
import { RawPostData } from "./dto/posts.raw-dto"

export class Post {
    public id: string
    private title: string
    private shortDescription: string
    private content: string
    private blogId: string
    private blogName: string
    private createdAt: Date
    private deletedAt: Date | null = null

    constructor(dto: RawPostData) {
        this.id = dto.id
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = dto.blogName
        this.createdAt = dto.createdAt
    }

    getPersistenceData() {
        return {
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName,
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

    update(dto: UpdatePostInputDto & { blogName: string }): void {
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = dto.blogName
    }
}