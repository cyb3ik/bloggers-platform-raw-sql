import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { add } from "date-fns/add"

@Schema({ _id: false })
class EmailConfirmationInfo {
    @Prop({ type: String, required: false })
    confirmationCode?: string

    @Prop({ type: Date, required: false })
    expirationDate?: Date

    @Prop({ type: Boolean, required: true })
    isConfirmed: boolean
}

@Schema({ _id: false })
class PasswordRecoveryInfo {
    @Prop({ type: String, required: false })
    recoveryCode?: string

    @Prop({ type: Date, required: false })
    expirationDate?: Date
}

@Schema({ timestamps: true })
export class MongoUser {

    @Prop({ type: String, required: true })
    _id: string

    @Prop({ type: String, required: true })
    login: string

    @Prop({ type: String, required: true })
    passwordSalt: string

    @Prop({ type: String, required: true })
    passwordHash: string

    @Prop({ type: String, required: true })
    email: string

    @Prop({ type: EmailConfirmationInfo, required: true })
    emailConfirmation: EmailConfirmationInfo

    @Prop({ type: PasswordRecoveryInfo, required: false, default: null })
    passwordRecovery: PasswordRecoveryInfo

    createdAt: Date
    updatedAt: Date

    @Prop({ type: Date, nullable: true, default: null })
    deletedAt: Date | null
}

export const UserSchema = SchemaFactory.createForClass(MongoUser)
UserSchema.loadClass(MongoUser)

export type UserDocument = HydratedDocument<MongoUser>
export type UserModelType = Model<UserDocument> & typeof MongoUser



