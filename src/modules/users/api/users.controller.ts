import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserInputDto } from './dto/users.input-dto';
import { UsersQueryParams } from './dto/users.query.params-dto';
import { BasicAuthGuard } from '../../../core/guards/basic.auth.guard';
import { Types } from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/commands/create-user.usecase';
import { FindUserByIdQuery } from '../application/use-cases/queries/find-user-by-id.query';
import { FindAllUsersQuery } from '../application/use-cases/queries/find-all-users.query';
import { DeleteUserCommand } from '../application/use-cases/commands/delete-user.usecase';

@Controller('users')
export class UsersController {

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

    @Get(':id')
    @UseGuards(BasicAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findUserById(@Param('id') id: string) {
        return this.QueryBus.execute(new FindUserByIdQuery(id))
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
