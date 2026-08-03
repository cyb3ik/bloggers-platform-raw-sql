import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class BasicAuthGuard implements CanActivate {

    private readonly validUsername = 'admin'
    private readonly validPassword = 'qwerty'

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw new UnauthorizedException()
        }

        const [authType, token] = authHeader.split(' ')
        if (authType !== 'Basic') {
            throw new UnauthorizedException()
        }

        const credentials = Buffer.from(token, 'base64').toString('utf-8')
        const [username, password] = credentials.split(':')

        if (username !== this.validUsername || password !== this.validPassword) {
            throw new UnauthorizedException()
        }

        return true
    }
}