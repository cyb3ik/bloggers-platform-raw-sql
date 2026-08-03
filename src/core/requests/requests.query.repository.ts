import { Injectable } from "@nestjs/common";
import { MongoRequest, type RequestModelType } from "./entity/request-mongoose.entity";
import { InjectModel } from "@nestjs/mongoose";
import { add } from "date-fns/add";
import { IRequestsQueryRepository } from "../interfaces/repositories/requests/requests-query-repository.interface";

@Injectable()
export class RequestsQueryRepository implements IRequestsQueryRepository {
    constructor(
        @InjectModel(MongoRequest.name) private readonly RequestModel: RequestModelType
    ) { }

    async getRequestsRate(ip: string, url: string, date: Date) {
        const rate = await this.RequestModel.countDocuments({
            ip: ip,
            url: url,
            date: {
                $gte: add(date, {
                    seconds: -10
                })
            }
        })
        return rate
    }
}