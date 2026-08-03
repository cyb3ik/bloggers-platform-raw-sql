import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

const ids = ['id', 'blogId', 'postId', 'commentId', 'userId']

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (ids.includes(metadata.data)) {
            if (!isValidObjectId(value)) {
                throw new BadRequestException([
                    {
                        message: 'Invalid ObjectId',
                        field: metadata.data ?? 'id',
                    },
                ])
            }
            return value.toString()
        }
        return value
    }
}