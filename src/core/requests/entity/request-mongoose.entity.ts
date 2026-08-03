import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

@Schema({ timestamps: false })
export class MongoRequest {
    @Prop({ type: String, required: true })
    _id: string

    @Prop({ type: String, required: true })
    ip: string

    @Prop({ type: String, required: true })
    url: string

    @Prop({ type: Date, required: true })
    date: Date
}

export const RequestSchema = SchemaFactory.createForClass(MongoRequest)
RequestSchema.loadClass(MongoRequest)

export type RequestDocument = HydratedDocument<MongoRequest>
export type RequestModelType = Model<RequestDocument> & typeof MongoRequest