import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractSessionInfoFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        const sessionInfo = req.session

        if (!sessionInfo) {
            throw new Error('there is no sessionInfo in the request object!');
        }

        return sessionInfo
    },
)