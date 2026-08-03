import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';
import { Post } from '../domain/post-domain.entity';
import { MongoPost, type PostModelType } from '../domain/post-mongoose.entity';
import { RawPostData } from '../domain/dto/posts.raw-dto';


@Injectable()
export class PostsRepository implements BaseRepository<Post> {
    constructor(@InjectModel(MongoPost.name) private readonly PostModel: PostModelType) { }

    async save(post: Post) {
        const data = post.getPersistenceData()

        await this.PostModel.updateOne(
            { _id: post.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Post | null> {
        const postDocument = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!postDocument) {
            return null
        }

        const postData = RawPostData.createFromDocument(postDocument)

        return new Post(postData)
    }
}
