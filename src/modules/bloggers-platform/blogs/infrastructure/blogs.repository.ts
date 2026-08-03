import { InjectModel } from '@nestjs/mongoose';
import { MongoBlog, type BlogModelType } from '../domain/blog-mongoose.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../core/interfaces/repositories/base-repository.interface';
import { Blog } from '../domain/blog-domain.entity';
import { RawBlogData } from '../domain/dto/blog.raw-dto';

@Injectable()
export class BlogsRepository implements BaseRepository<Blog> {
    constructor(@InjectModel(MongoBlog.name) private readonly BlogModel: BlogModelType) { }

    async save(blog: Blog) {
        const data = blog.getPersistenceData()

        await this.BlogModel.updateOne(
            { _id: blog.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Blog | null> {
        const blogDocument = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!blogDocument) {
            return null
        }

        const blogData = RawBlogData.createFromDocument(blogDocument)

        return new Blog(blogData)
    }
}
