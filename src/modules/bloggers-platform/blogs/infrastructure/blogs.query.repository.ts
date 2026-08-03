import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoBlog } from "../domain/blog-mongoose.entity";
import type { BlogModelType } from "../domain/blog-mongoose.entity";
import { BlogViewDto } from "../api/dto/blogs.view-dto";
import { BlogsQueryParams } from "../api/dto/blogs.query.params-dto";
import { PaginatedViewDto } from "../../../../core/dto/paginated.view-dto";
import { BaseQueryRepository } from "../../../../core/interfaces/repositories/query-repository.interface";
import { RawBlogData } from "../domain/dto/blog.raw-dto";


@Injectable()
export class BlogsQueryRepository implements BaseQueryRepository<BlogViewDto, BlogsQueryParams> {
    constructor(@InjectModel(MongoBlog.name) private readonly BlogModel: BlogModelType) { }

    async getEntityById(id: string): Promise<BlogViewDto | null> {
        const blogDocument = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        }).lean()

        if (!blogDocument) {
            return null
        }

        const blogData = RawBlogData.createFromDocument(blogDocument)

        return new BlogViewDto(blogData)
    }

    async getAllEntities(query: BlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query

        const skip = query.calculateSkip()

        const filter: any = { deletedAt: null }
        filter.$or = []

        if (searchNameTerm) {
            filter.$or.push({ name: { $regex: searchNameTerm, $options: 'i' } })
        }

        const result = await this.BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean()

        const totalCount = await this.BlogModel.countDocuments(filter)

        return PaginatedViewDto.mapToView({
            items: result.map(blogDocument => {
                const blogData = RawBlogData.createFromDocument(blogDocument)

                return new BlogViewDto(blogData)
            }),
            page: pageNumber,
            size: pageSize,
            totalCount: totalCount
        })
    }
}
