import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoBlog, BlogSchema } from '../bloggers-platform/blogs/domain/blog-mongoose.entity';
import { MongoUser, UserSchema } from '../users/domain/user-mongoose.entity';
import { LikeSchema, MongoLike } from '../bloggers-platform/likes/domain/like-mongoose.entity';
import { MongoPost, PostSchema } from '../bloggers-platform/posts/domain/post-mongoose.entity';
import { CommentSchema, MongoComment } from '../bloggers-platform/comments/domain/comment-mongoose.entity';
import { MongoSession, SessionSchema } from '../sessions/domain/session-mongoose.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.POSTGRES_DB_URI,
            synchronize: false
        }),
        MongooseModule.forFeature([
            { name: MongoUser.name, schema: UserSchema },
            { name: MongoBlog.name, schema: BlogSchema },
            { name: MongoPost.name, schema: PostSchema },
            { name: MongoComment.name, schema: CommentSchema },
            { name: MongoLike.name, schema: LikeSchema },
            { name: MongoSession.name, schema: SessionSchema },
        ])
    ],
    controllers: [TestingController],
    providers: [TestingService]
})
export class TestingModule { }