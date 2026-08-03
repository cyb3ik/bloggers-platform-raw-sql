import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateBlogInputDto } from "../../../api/dto/blogs.input-dto";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { NotFoundException } from "@nestjs/common";


export class UpdateBlogCommand {
    constructor(
        public readonly blogId: string,
        public readonly dto: UpdateBlogInputDto
    ) { }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
    implements ICommandHandler<UpdateBlogCommand> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ blogId, dto }: UpdateBlogCommand): Promise<void> {
        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog was not found')
        }

        blog.update(dto)

        await this.BlogsRepository.save(blog)
    }
}