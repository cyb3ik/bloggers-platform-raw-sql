import { configModule } from './dynamic-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_DB_URI,
      synchronize: false
    }),
    configModule,
    ...(process.env.INCLUDE_TESTING_MODULE ? [TestingModule] : []),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(10),
          limit: 5
        }
      ]
    }),
    UsersModule,
    BloggersPlatformModule,
    SuperAdminModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})

export class AppModule { }
