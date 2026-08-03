import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestsRepository } from "../requests/requests.repository";
import { randomUUID } from "crypto";
import { Request } from "../requests/entity/request-domain.entity";

@Injectable()
export class SaveReqInfoGuard implements CanActivate {
    constructor(
        private readonly RequestsRepository: RequestsRepository
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest()

        const requestDto = {
            id: randomUUID().toString(),
            ip: req.ip!,
            url: req.originalUrl,
            date: new Date()
        }

        const request = new Request(requestDto)

        await this.RequestsRepository.save(request)

        return true
    }
}