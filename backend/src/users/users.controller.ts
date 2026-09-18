import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";
import { UpdateUsersDto } from "./dto/update-users.dto";
import { CreateUsersDto } from "./dto/create-users.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@UseGuards(JwtAuthGuard , RolesGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

@Get()
    findAll() {
        return this.usersService.findAll();
    }

@Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

@Post()
    create(@Body() dto: CreateUsersDto) {
        return this.usersService.create(dto);
    }

@Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUsersDto) {
        return this.usersService.update(Number(id), dto);
    }

@Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(Number(id));
    }

}