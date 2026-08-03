import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../../infrastructure/posts.repository";
import { UpdatePostInputDto } from "../../../api/dto/posts.input-dto";
import { BlogsRepository } from "../../../../blogs/infrastructure/blogs.repository";


export class UpdatePostCommand {
    constructor(
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

    async execute({ postId, dto }: UpdatePostCommand): Promise<void> {
        const post = await this.PostsRepository.findEntityById(postId)

        if (!post) {
            throw new NotFoundException('Post was not found')
        }

        const blogId = dto.blogId

        const blog = await this.BlogsRepository.findEntityById(blogId)

        if (!blog) {
            throw new NotFoundException('Blog was not found')
        }

        const blogData = blog.getPersistenceData()

        post.update({
            ...dto,
            blogName: blogData.name
        })

        await this.PostsRepository.save(post)
    }
}