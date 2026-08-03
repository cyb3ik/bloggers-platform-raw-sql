import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../../infrastructure/blogs.repository";
import { NotFoundException } from "@nestjs/common";


export class DeleteBlogCommand {
    constructor(
        public readonly blogId: string
    ) { }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
    implements ICommandHandler<DeleteBlogCommand> {
    constructor(
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ blogId }: DeleteBlogCommand): Promise<void> {
        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog was not found')
        }

        blog.softDeleteSelf()

        await this.BlogsRepository.save(blog)
    }
}