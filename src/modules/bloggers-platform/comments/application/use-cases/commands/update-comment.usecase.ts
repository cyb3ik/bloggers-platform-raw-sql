import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "../../../infrastructure/comments.repository";
import { UpdateCommentInputDto } from "../../../api/dto/comments.input-dto";


export class UpdateCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly dto: UpdateCommentInputDto,
        public readonly userId: string,
    ) { }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
    implements ICommandHandler<UpdateCommentCommand> {
    constructor(
        private readonly CommentsRepository: CommentsRepository
    ) { }

    async execute({ commentId, dto, userId }: UpdateCommentCommand): Promise<void> {
        const comment = await this.CommentsRepository.findEntityById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment was not found')
        }

        const commentData = comment.getPersistenceData()

        if (commentData.commentatorInfo.userId !== userId) {
            throw new ForbiddenException()
        }

        comment.update(dto)

        await this.CommentsRepository.save(comment)
    }
}