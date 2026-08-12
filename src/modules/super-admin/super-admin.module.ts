import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { SaUsersController } from "./super-admin-users.controller";
import { SaBlogsController } from "./super-admin-blogs.controller";
import { SaPostsController } from "./super-admin-posts.controller";
import { BloggersPlatformModule } from "../bloggers-platform/bloggers-platform.module";

@Module({
    imports: [
        UsersModule,
        BloggersPlatformModule,
        JwtModule
    ],
    controllers: [SaUsersController, SaBlogsController, SaPostsController],
    providers: [],
    exports: []
})

export class SuperAdminModule { }
