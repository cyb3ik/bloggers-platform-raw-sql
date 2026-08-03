import { Global, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { configValidationUtility } from "./utilities/config-validation.utility";

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

@Global()
@Injectable()
export class CoreConfig {
    constructor(
        private readonly configService: ConfigService<any, true>
    ) {

        this.port = Number(this.configService.get('PORT'))
        this.mongoURI = this.configService.get('MONGO_URI')
        this.env = this.configService.get('NODE_ENV')
        this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET')
        this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET')

        configValidationUtility.validateConfig(this)
    }

    @IsNumber(
        {},
        {
            message: 'Set Env variable PORT, example: 3000',
        },
    )
    port: number

    @IsNotEmpty({
        message:
            'Set Env variable MONGO_URI, example: mongodb://localhost:27017/my-app-local-db',
    })
    mongoURI: string

    @IsEnum(Environments, {
        message:
            'Set correct NODE_ENV value, available values: ' +
            configValidationUtility.getEnumValues(Environments).join(', '),
    })
    env: string

    @IsNotEmpty({
        message: 'Set Env variable REFRESH_TOKEN_SECRET, dangerous for security!',
    })
    refreshTokenSecret: string

    @IsNotEmpty({
        message: 'Set Env variable ACCESS_TOKEN_SECRET, dangerous for security!',
    })
    accessTokenSecret: string

}