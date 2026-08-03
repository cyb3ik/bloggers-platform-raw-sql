import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";


export class DeleteCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly userId: string
    ) { }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
    implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId, userId }: DeleteCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findEntityById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        const commentData = comment.getPersistenceData()

        if (commentData.commentatorInfo.userId !== userId) {
            throw new ForbiddenException()
        }

        comment.softDeleteSelf()

        await this.CommentsRepository.save(comment)
    }
}