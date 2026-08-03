import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoBlog, BlogSchema } from "./blogs/domain/blog-mongoose.entity";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./blogs/infrastructure/blogs.query.repository";
import { PostsService } from "./posts/application/posts.service";
import { PostsRepository } from "./posts/infrastructure/posts.repository";
import { PostsQueryRepository } from "./posts/infrastructure/posts.query.repository";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsRepository } from "./comments/infrastructure/comments.repository";
import { CommentsQueryRepository } from "./comments/infrastructure/comments.query.repository";
import { BlogsController } from "./blogs/api/blogs.controller";
import { PostsController } from "./posts/api/posts.controller";
import { CommentsController } from "./comments/api/comments.controller";
import { CreateBlogUseCase } from "./blogs/application/use-cases/commands/create-blog.usecase";
import { CreatePostForBlogUseCase } from "./blogs/application/use-cases/commands/create-post-for-blog.usecase";
import { UpdateBlogUseCase } from "./blogs/application/use-cases/commands/update-blog.usecase";
import { DeleteBlogUseCase } from "./blogs/application/use-cases/commands/delete-blog.usecase";
import { FindAllBlogsQueryHandler } from "./blogs/application/use-cases/queries/find-all-blogs.query";
import { FindBlogByIdQueryHandler } from "./blogs/application/use-cases/queries/find-blog-by-id.query";
import { FindAllPostsFromBlogQueryHandler } from "./blogs/application/use-cases/queries/find-all-posts-from-blog.query";
import { FindPostByIdQueryHandler } from "./posts/application/use-cases/queries/find-post-by-id.query";
import { FindAllCommentsFromPostQueryHandler } from "./posts/application/use-cases/queries/find-all-comments-from-post.query";
import { UpdatePostUseCase } from "./posts/application/use-cases/commands/update-post.usecase";
import { DeletePostUseCase } from "./posts/application/use-cases/commands/delete-post.usecase";
import { FindCommentByIdQueryHandler } from "./comments/application/use-cases/queries/find-comment-by-id.query";
import { UpdateCommentUseCase } from "./comments/application/use-cases/commands/update-comment.usecase";
import { DeleteCommentUseCase } from "./comments/application/use-cases/commands/delete-comment.usecase";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from "../../core/constants/jwt-tokens";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { FindAllPostsQueryHandler } from "./posts/application/use-cases/queries/find-all-posts.query";
import { ChangeLikeStatusOnCommentUseCase } from "./comments/application/use-cases/commands/change-like-status-on-comment.usecase";
import { CreateCommentForPostUseCase } from "./posts/application/use-cases/commands/create-comment-for-post.usecase";
import { ChangeLikeStatusOnPostUseCase } from "./posts/application/use-cases/commands/change-like-status-on-post.usecase";
import { LikeSchema, MongoLike } from "./likes/domain/like-mongoose.entity";
import { LikesRepository } from "./likes/repositories/likes.repository";
import { LikesQueryRepository } from "./likes/repositories/likes.query.repository";
import { MongoPost, PostSchema } from "./posts/domain/post-mongoose.entity";
import { CommentSchema, MongoComment } from "./comments/domain/comment-mongoose.entity";

const blogsCommands = [
    CreateBlogUseCase,
    CreatePostForBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase
]
const blogsQueries = [
    FindAllBlogsQueryHandler,
    FindBlogByIdQueryHandler,
    FindAllPostsFromBlogQueryHandler
]

const postsCommands = [
    UpdatePostUseCase,
    DeletePostUseCase,
    ChangeLikeStatusOnPostUseCase,
    CreateCommentForPostUseCase
]
const postsQueries = [
    FindAllPostsQueryHandler,
    FindPostByIdQueryHandler,
    FindAllCommentsFromPostQueryHandler
]

const commentsCommands = [
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    ChangeLikeStatusOnCommentUseCase
]
const commentsQueries = [
    FindCommentByIdQueryHandler
]

const commandHandlers = [...blogsCommands, ...postsCommands, ...commentsCommands]
const queryHandlers = [...blogsQueries, ...postsQueries, ...commentsQueries]

@Module({
    imports: [MongooseModule.forFeature([
        { name: MongoBlog.name, schema: BlogSchema },
        { name: MongoPost.name, schema: PostSchema },
        { name: MongoComment.name, schema: CommentSchema },
        { name: MongoLike.name, schema: LikeSchema }
    ]),
        UsersModule],
    providers: [
        BlogsService,
        BlogsRepository,
        BlogsQueryRepository,
        PostsService,
        PostsRepository,
        PostsQueryRepository,
        CommentsService,
        CommentsRepository,
        CommentsQueryRepository,
        ...commandHandlers,
        ...queryHandlers,
        {
            provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (): JwtService => {
                return new JwtService({
                    secret: 'access-token-secret',
                    signOptions: { expiresIn: '5m' },
                })
            }
        },
        LikesRepository,
        LikesQueryRepository
    ],
    controllers: [
        BlogsController,
        PostsController,
        CommentsController
    ]
})

export class BloggersPlatformModule { }
