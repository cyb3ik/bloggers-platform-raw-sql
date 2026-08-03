import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { CreatePostForBlogInputDto } from "../../../../posts/api/dto/posts.input-dto";
import { PostsRepository } from "../../../../posts/infrastructure/posts.repository";
import { NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Post } from "../../../../posts/domain/post-domain.entity";


export class CreatePostForBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly dto: CreatePostForBlogInputDto
    ) { }
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase
    implements ICommandHandler<CreatePostForBlogCommand> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ blogId, dto }: CreatePostForBlogCommand): Promise<string> {

        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog not found')
        }

        const blogData = blog.getPersistenceData()

        const postDomainDto = {
            id: randomUUID().toString(),
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blogData.name,
            createdAt: new Date()
        }

        const post = new Post(postDomainDto)

        await this.PostsRepository.save(post)

        return post.id
    }
}