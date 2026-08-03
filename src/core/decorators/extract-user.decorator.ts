import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractUserFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        const user = req.user

        if (!user) {
            throw new Error('there is no user in the request object!');
        }

        return user
    },
)