import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BlocosService } from "./blocos.service";
import { CreateBlocoDto } from './dto/create-bloco.dto';
import { UpdateBlocoDto } from './dto/update-bloco.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blocos')
export class BlocosController {
    constructor(private blocosService: BlocosService){}

    @Get()
    findAll(){
        return this.blocosService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.blocosService.findOne(Number(id))
    }

    @Roles('ADMIN','COMISSAO_CURSO','COMISSAO_ESCOLA')
    @Post()
    create(@Body() dto: CreateBlocoDto){
        return this.blocosService.create(dto)
    }

    @Roles('ADMIN','COMISSAO_CURSO','COMISSAO_ESCOLA')
    @Put(':id')
    update(@Param('id') id : string, @Body() dto:UpdateBlocoDto){
        return this.blocosService.update(Number(id), dto)
    }

    @Roles('ADMIN','COMISSAO_CURSO','COMISSAO_ESCOLA')
    @Delete(':id')    
    remove(@Param('id') id:string){
        return this.blocosService.remove(Number(id))
    }
}