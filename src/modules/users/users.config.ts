import { Global, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { configValidationUtility } from "../../core/utilities/config-validation.utility"
import { IsBoolean, IsNotEmpty } from "class-validator"

@Global()
@Injectable()
export class UsersConfig {
    constructor(
        private readonly configService: ConfigService<any, true>
    ) {
        this.refreshTokenExpirationTime = this.configService.get('REFRESH_TOKEN_EXPIRE_IN')
        this.accessTokenExpirationTime = this.configService.get('ACCESS_TOKEN_EXPIRE_IN')
        this.isUserAutoConfirmed = configValidationUtility.convertToBoolean(this.configService.get('IS_USER_AUTOMATICALLY_CONFIRMED'))

        configValidationUtility.validateConfig(this)
    }

    @IsNotEmpty({
        message: 'Set Env variable REFRESH_TOKEN_EXPIRE_IN',
    })
    refreshTokenExpirationTime: string

    @IsNotEmpty({
        message: 'Set Env variable ACCESS_TOKEN_EXPIRE_IN',
    })
    accessTokenExpirationTime: string

    @IsBoolean({
        message: 'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED',
    })
    isUserAutoConfirmed: boolean
}