import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../../infrastructure/posts.repository";
import { BlogsRepository } from "../../../../blogs/infrastructure/blogs.repository";


export class DeletePostCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string
    ) { }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand> {
    constructor(
        private readonly PostsRepository: PostsRepository,
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ blogId, postId }: DeletePostCommand): Promise<void> {

        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog was not found')
        }

        const post = await this.PostsRepository.findEntityById(postId)

        if (!post) {
            throw new NotFoundException('Post was not found')
        }

        const postData = post.getPersistenceData()

        if (postData.blogId !== blog.id) {
            throw new ForbiddenException()
        }

        post.softDeleteSelf()

        await this.PostsRepository.save(post)
    }
}