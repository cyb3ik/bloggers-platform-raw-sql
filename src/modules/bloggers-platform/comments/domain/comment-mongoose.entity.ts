import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";

@Schema({ _id: false })
class CommentatorInfo {
    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: String, required: true })
    userLogin: string
}

export const CommentatorInfoSchema =
    SchemaFactory.createForClass(CommentatorInfo);

@Schema({ timestamps: true })
export class MongoComment {

    @Prop({ type: String, required: true })
    postId: string

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: CommentatorInfo, required: true })
    commentatorInfo: CommentatorInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null
}

export const CommentSchema = SchemaFactory.createForClass(MongoComment)
CommentSchema.loadClass(MongoComment)

export type CommentDocument = HydratedDocument<MongoComment>
export type CommentModelType = Model<CommentDocument> & typeof MongoComment