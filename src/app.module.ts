import { configModule } from './dynamic-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './modules/testing/testing.module';
import { APP_GUARD } from '@nestjs/core';
import { SaveReqInfoGuard } from './core/guards/save-req-info.guard';
import { RequestsRepository } from './core/requests/requests.repository';
import { MongoRequest, RequestSchema } from './core/requests/entity/request-mongoose.entity';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: MongoRequest.name, schema: RequestSchema }]),
    configModule,
    ...(process.env.INCLUDE_TESTING_MODULE ? [TestingModule] : []),
    UsersModule,
    BloggersPlatformModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RequestsRepository,
    {
      provide: APP_GUARD,
      useClass: SaveReqInfoGuard,
    }
  ],
})

export class AppModule { }
