import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isUUID } from "class-validator";

const ids = ['id', 'blogId', 'postId', 'commentId', 'userId']

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (ids.includes(metadata.data)) {
            if (!isUUID(value)) {
                throw new BadRequestException([
                    {
                        message: 'Invalid UUID',
                        field: metadata.data ?? 'id',
                    },
                ])
            }
            return value.toString()
        }
        return value
    }
}