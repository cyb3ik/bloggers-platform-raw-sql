import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class TestingService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,

    ) { }

    async deleteAll() {
        await this.dataSource.query(`
            TRUNCATE TABLE
                likes,
                comments,
                posts,
                blogs,
                sessions,
                users
            RESTART IDENTITY
        `)
    }
}