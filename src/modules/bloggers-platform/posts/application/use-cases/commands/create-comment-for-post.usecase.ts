import { InjectModel } from "@nestjs/mongoose";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../../../posts/infrastructure/posts.repository";
import { NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../../comments/infrastructure/comments.repository";
import { CreateCommentInputDto } from "../../../../comments/api/dto/comments.input-dto";
import { UserInfo } from "../../../../../users/api/dto/user-info.dto";
import { randomUUID } from "crypto";
import { Comment } from "../../../../comments/domain/comment-domain.entity";


export class CreateCommentForPostCommand {
    constructor(
        public readonly postId: string,
        public readonly user: UserInfo,
        public readonly dto: CreateCommentInputDto
    ) { }
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
    implements ICommandHandler<CreateCommentForPostCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository,
        private readonly PostsRepository: PostsRepository,
    ) { }

    async execute({ postId, user, dto }: CreateCommentForPostCommand) {

        const post = await this.PostsRepository.findEntityById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const commentDomainDto = {
            id: randomUUID().toString(),
            content: dto.content,
            userId: user.id,
            userLogin: user.login,
            postId: postId,
            createdAt: new Date()
        }

        const comment = new Comment(commentDomainDto)

        await this.CommentsRepository.save(comment)

        return comment.id
    }
}