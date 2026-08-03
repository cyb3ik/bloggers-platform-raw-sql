import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

@Schema({ timestamps: true })
export class MongoBlog {

    @Prop({ type: String, required: true })
    _id: string

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    websiteUrl: string

    @Prop({ type: Boolean, required: true })
    isMembership: boolean

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null
}

export const BlogSchema = SchemaFactory.createForClass(MongoBlog)
BlogSchema.loadClass(MongoBlog)

export type BlogDocument = HydratedDocument<MongoBlog>
export type BlogModelType = Model<BlogDocument> & typeof MongoBlog