import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ChangeLikeStatusInputDto } from "../../../../likes/dto/change-like-status-input.dto"
import { CommentsRepository } from "../../../infrastructure/comments.repository"
import { NotFoundException } from "@nestjs/common"
import { UserInfo } from "../../../../../users/api/dto/user-info.dto"
import { LikeStatus } from "../../../../likes/dto/like.raw-dto"
import { Like } from "../../../../likes/domain/like-domain.entity"
import { randomUUID } from "crypto"
import { LikesRepository } from "../../../../likes/repositories/likes.repository"

export class ChangeLikeStatusOnCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly user: UserInfo,
        public readonly dto: ChangeLikeStatusInputDto
    ) { }
}

@CommandHandler(ChangeLikeStatusOnCommentCommand)
export class ChangeLikeStatusOnCommentUseCase
    implements ICommandHandler<ChangeLikeStatusOnCommentCommand> {
    constructor(
        private readonly LikesRepository: LikesRepository,
        private readonly CommentsRepository: CommentsRepository,
    ) { }

    async execute({ commentId, user, dto }: ChangeLikeStatusOnCommentCommand): Promise<void> {

        const comment = await this.CommentsRepository.findEntityById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        const like = await this.LikesRepository.findLikeByUserId(commentId, user.id)

        if (!like) {

            if (dto.likeStatus === LikeStatus.None) {
                return
            }

            const likeDomainDto = {
                id: randomUUID().toString(),
                userId: user.id,
                entityId: commentId,
                userLogin: user.login,
                status: dto.likeStatus,
                createdAt: new Date()
            }

            const newLike = new Like(likeDomainDto)

            await this.LikesRepository.save(newLike)

        } else {
            if (like.status === LikeStatus.Like) {
                switch (dto.likeStatus) {
                    case (LikeStatus.Dislike):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            } else {
                switch (dto.likeStatus) {
                    case (LikeStatus.Like):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                    case (LikeStatus.None):
                        like.updateLikeStatus(dto.likeStatus)
                        break
                }
            }
            await this.LikesRepository.save(like)
        }
    }
}