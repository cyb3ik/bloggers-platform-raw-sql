import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CheckGuestStatus = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        const user = req.user

        if (!user) {
            return null
        }

        return user
    },
)