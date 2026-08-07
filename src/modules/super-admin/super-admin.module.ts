import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { CqrsModule } from "@nestjs/cqrs";
import { SaUsersController } from "./super-admin-users.controller";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../../core/constants/jwt-tokens";
import { CoreConfig } from "../../core/core.config";
import { UsersConfig } from "../users/users.config";

@Module({
    imports: [
        UsersModule,
        JwtModule,
        CqrsModule.forRoot()
    ],
    controllers: [SaUsersController],
    providers: [
        {
            provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (
                coreConfig: CoreConfig,
                usersConfig: UsersConfig
            ): JwtService => {
                return new JwtService({
                    secret: coreConfig.saAccessTokenSecret,
                    //@ts-ignore
                    signOptions: { expiresIn: usersConfig.saAccessTokenExpirationTime },
                })
            },
            inject: [CoreConfig, UsersConfig]
        },
        {
            provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
            useFactory: (
                coreConfig: CoreConfig,
                usersConfig: UsersConfig
            ): JwtService => {
                return new JwtService({
                    secret: coreConfig.saRefreshTokenSecret,
                    //@ts-ignore
                    signOptions: { expiresIn: usersConfig.saRefreshTokenExpirationTime },
                })
            },
            inject: [CoreConfig, UsersConfig]
        },
    ],
    exports: []
})

export class SuperAdminModule { }
