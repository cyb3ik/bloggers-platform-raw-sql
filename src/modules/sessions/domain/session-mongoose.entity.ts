import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

@Schema({ timestamps: false })
export class MongoSession {
    @Prop({ type: String, required: true })
    _id: string

    @Prop({ type: String, required: true })
    ip: string

    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: Number, required: true })
    lastActiveDate: number

    @Prop({ type: String, required: true })
    deviceId: string

    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: Number, required: true })
    exp: number
}

export const SessionSchema = SchemaFactory.createForClass(MongoSession)
SessionSchema.loadClass(MongoSession)

export type SessionDocument = HydratedDocument<MongoSession>
export type SessionModelType = Model<SessionDocument> & typeof MongoSession