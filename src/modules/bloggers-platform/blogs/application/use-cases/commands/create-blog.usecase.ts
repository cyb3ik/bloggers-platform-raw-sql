import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBlogInputDto } from "../../../api/dto/blogs.input-dto";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { randomUUID } from "crypto";
import { Blog } from "../../../domain/blog-domain.entity";


export class CreateBlogCommand {
    constructor(public readonly dto: CreateBlogInputDto) { }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
    implements ICommandHandler<CreateBlogCommand> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ dto }: CreateBlogCommand): Promise<string> {

        const domainDto = {
            id: randomUUID().toString(),
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false,
            createdAt: new Date()
        }

        const blog = new Blog(domainDto)

        await this.BlogsRepository.save(blog)

        return blog.id
    }
}