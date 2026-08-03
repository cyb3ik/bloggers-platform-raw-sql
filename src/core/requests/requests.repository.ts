import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoRequest, type RequestModelType } from "./entity/request-mongoose.entity";
import { Request } from "./entity/request-domain.entity";
import { BaseRepository } from "../interfaces/repositories/base-repository.interface";

@Injectable()
export class RequestsRepository implements BaseRepository<Request> {
    constructor(
        @InjectModel(MongoRequest.name) private readonly RequestModel: RequestModelType
    ) { }

    async save(req: Request) {
        const data = req.getPersistenceData()

        await this.RequestModel.updateOne(
            { _id: req.id },
            { $set: data },
            { upsert: true }
        )
    }

    async findEntityById(id: string): Promise<Request | null> {
        const requestDocument = await this.RequestModel.findOne({
            _id: id
        })

        if (!requestDocument) {
            return null
        }

        return new Request({
            id: requestDocument._id,
            ip: requestDocument.ip,
            url: requestDocument.url,
            date: requestDocument.date
        })
    }
}