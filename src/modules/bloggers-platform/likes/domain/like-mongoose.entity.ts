import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { LikeStatus } from "../dto/like.raw-dto";

@Schema({ timestamps: true })
export class MongoLike {
    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: String, required: true })
    entityId: string

    @Prop({ type: String, required: true })
    userLogin: string

    @Prop({ type: String, enum: LikeStatus, required: true })
    status: LikeStatus

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null
}

export const LikeSchema = SchemaFactory.createForClass(MongoLike)
LikeSchema.loadClass(MongoLike)

export type LikeDocument = HydratedDocument<MongoLike>
export type LikeModelType = Model<LikeDocument> & typeof MongoLike