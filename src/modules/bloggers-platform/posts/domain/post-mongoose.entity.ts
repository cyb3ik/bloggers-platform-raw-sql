import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { UpdatePostInputDto } from "../api/dto/posts.input-dto";

@Schema({ timestamps: true })
export class MongoPost {

    @Prop({ type: String, required: true })
    _id: string

    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: String, required: true })
    shortDescription: string

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: String, required: true })
    blogId: string

    @Prop({ type: String, required: true })
    blogName: string

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null
}

export const PostSchema = SchemaFactory.createForClass(MongoPost)
PostSchema.loadClass(MongoPost)

export type PostDocument = HydratedDocument<MongoPost>
export type PostModelType = Model<PostDocument> & typeof MongoPost