import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { BcryptService } from './application/bcrypt.service';
import { CqrsModule } from '@nestjs/cqrs';
import { FindUserByIdQueryHandler } from './application/use-cases/queries/find-user-by-id.query';
import { FindAllUsersQueryHandler } from './application/use-cases/queries/find-all-users.query';
import { CreateUserUseCase } from './application/use-cases/commands/create-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/commands/delete-user.usecase';
import { LoginUserUseCase } from '../auth/application/use-cases/commands/login-user.usecase';
import { RegisterUserUseCase } from '../auth/application/use-cases/commands/register-user.usecase';
import { ConfirmUserEmailUseCase } from '../auth/application/use-cases/commands/confirm-user-email.usecase';
import { ResendConfirmationCodeUseCase } from '../auth/application/use-cases/commands/resend-confirmation-code.usecase';
import { ChangeUserPasswordUseCase } from '../auth/application/use-cases/commands/change-user-password.usecase';
import { RecoverUserPasswordUseCase } from '../auth/application/use-cases/commands/recover-user-password.usecase';
import { GetMePageQueryHandler } from '../auth/application/use-cases/queries/get-me-page.query';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from '../auth/application/mail.service';
import { AuthController } from '../auth/api/auth.controller';
import { AuthService } from '../auth/application/auth.service';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../core/constants/jwt-tokens';
import { CoreConfig } from '../../core/core.config';
import { UsersConfig } from './users.config';
import { RequestsRepository } from '../../core/requests/requests.repository';
import { GenerateNewTokensUseCase } from '../auth/application/use-cases/commands/generate-new-tokens.usecase';
import { LogoutUseCase } from '../auth/application/use-cases/commands/logout.usecase';
import { SecurityDevicesController } from '../sessions/api/security-devices.controller';
import { FindAllUserSessionsQueryHandler } from '../sessions/use-cases/queries/find-all-user-sessions.query';
import { DeleteAllSessionExceptCurrentUseCase } from '../sessions/use-cases/commands/delete-all-sessions-except-current.usecase';
import { DeleteSpecifiedSessionUseCase } from '../sessions/use-cases/commands/delete-specified-session.usecase';
import { MongoUser, UserSchema } from './domain/user-mongoose.entity';
import { RequestsQueryRepository } from '../../core/requests/requests.query.repository';
import { MongoRequest, RequestSchema } from '../../core/requests/entity/request-mongoose.entity';
import { MongoSession, SessionSchema } from '../sessions/domain/session-mongoose.entity';
import { SessionsRepository } from '../sessions/infrastructure/sessions.repository';
import { SessionsQueryRepository } from '../sessions/infrastructure/sessions.query.repository';

const queryHandlers = [
  FindUserByIdQueryHandler,
  FindAllUsersQueryHandler,
  GetMePageQueryHandler,
  FindAllUserSessionsQueryHandler
]
const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ConfirmUserEmailUseCase,
  ResendConfirmationCodeUseCase,
  ChangeUserPasswordUseCase,
  RecoverUserPasswordUseCase,
  GenerateNewTokensUseCase,
  LogoutUseCase,
  DeleteAllSessionExceptCurrentUseCase,
  DeleteSpecifiedSessionUseCase
]

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoUser.name, schema: UserSchema },
      { name: MongoRequest.name, schema: RequestSchema },
      { name: MongoSession.name, schema: SessionSchema }
    ]),
    JwtModule,
    CqrsModule.forRoot()
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptService,
    AuthService,
    MailService,
    ...queryHandlers,
    ...commandHandlers,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (
        coreConfig: CoreConfig,
        usersConfig: UsersConfig
      ): JwtService => {
        return new JwtService({
          secret: coreConfig.accessTokenSecret,
          //@ts-ignore
          signOptions: { expiresIn: usersConfig.accessTokenExpirationTime },
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
          secret: coreConfig.refreshTokenSecret,
          //@ts-ignore
          signOptions: { expiresIn: usersConfig.refreshTokenExpirationTime },
        })
      },
      inject: [CoreConfig, UsersConfig]
    },
    UsersConfig,
    CoreConfig,
    RequestsRepository,
    RequestsQueryRepository,
    SessionsRepository,
    SessionsQueryRepository,
  ],
  exports: [
    UsersService,
    UsersRepository,
    BcryptService]
})
export class UsersModule { }
