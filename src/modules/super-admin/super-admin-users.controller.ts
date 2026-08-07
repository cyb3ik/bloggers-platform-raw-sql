import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../core/guards/basic.auth.guard";
import { UsersQueryParams } from "../users/api/dto/users.query.params-dto";
import { FindAllUsersQuery } from "../users/application/use-cases/queries/find-all-users.query";
import { CreateUserInputDto } from "../users/api/dto/users.input-dto";
import { CreateUserCommand } from "../users/application/use-cases/commands/create-user.usecase";
import { FindUserByIdQuery } from "../users/application/use-cases/queries/find-user-by-id.query";
import { DeleteUserCommand } from "../users/application/use-cases/commands/delete-user.usecase";
import { SkipThrottle } from "@nestjs/throttler";

@Controller('sa/users')
@SkipThrottle()
export class SaUsersController {
    constructor(
        private readonly CommandBus: CommandBus,
        private readonly QueryBus: QueryBus
    ) { }

    @Get()
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findAllUsers(@Query() query: UsersQueryParams) {
        return this.QueryBus.execute(new FindAllUsersQuery(query))
    }

    @Post()
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() dto: CreateUserInputDto) {
        const createdUserId = await this.CommandBus.execute(new CreateUserCommand(dto))

        return this.QueryBus.execute(new FindUserByIdQuery(createdUserId))
    }

    @Delete(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUserById(@Param('id') id: string) {
        return this.CommandBus.execute(new DeleteUserCommand(id))
    }
}