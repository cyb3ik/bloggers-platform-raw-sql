import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        if (status === HttpStatus.BAD_REQUEST) {
            const errorsRes = { errorsMessages: [] }

            const resBody: any = exception.getResponse()

            resBody.message.forEach(m => errorsRes.errorsMessages.push(m))

            response.status(HttpStatus.BAD_REQUEST).json(errorsRes)
        } else {
            response
                .status(status)
                .json({
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                })
        }
    }
}