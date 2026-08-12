import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../../infrastructure/posts.repository";
import { UpdatePostInputDto } from "../../../api/dto/posts.input-dto";
import { BlogsRepository } from "../../../../blogs/infrastructure/blogs.repository";


export class UpdatePostCommand {
    constructor(
        public readonly blogId: string,
        public readonly postId: string,
        public readonly dto: UpdatePostInputDto
    ) { }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
    implements ICommandHandler<UpdatePostCommand> {
    constructor(
        private readonly PostsRepository: PostsRepository,
        private readonly BlogsRepository: BlogsRepository,
    ) { }

    async execute({ blogId, postId, dto }: UpdatePostCommand): Promise<void> {

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

        post.update(dto)

        await this.PostsRepository.save(post)
    }
}