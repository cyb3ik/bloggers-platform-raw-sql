import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../../infrastructure/posts.repository";


export class DeletePostCommand {
    constructor(
        public readonly postId: string
    ) { }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
    implements ICommandHandler<DeletePostCommand> {
    constructor(
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ postId }: DeletePostCommand): Promise<void> {
        const post = await this.PostsRepository.findEntityById(postId)

        if (!post) {
            throw new NotFoundException('Post was not found')
        }

        post.softDeleteSelf()

        await this.PostsRepository.save(post)
    }
}