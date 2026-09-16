//imports
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BlocosService } from "./blocos.service";
import { CreateBlocoDto } from './dto/create-bloco.dto';
import { UpdateBlocoDto } from './dto/update-bloco.dto';

//Todos os endpoints deste controller estão protegidos com JWT
@UseGuards(JwtAuthGuard)
@Controller('blocos')
export class BlocosController {
    constructor(private blocosService: BlocosService){}

    // GET /blocos — lista todos os blocos
    @Get()
    findAll(){
        return this.blocosService.findAll()
    }

    // GET /blocos/:id - retorna um bloco pelo id
    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.blocosService.findOne(Number(id))
    }

    // POST /blocos - cria um novo bloco
    @Post()
    create(@Body() dto: CreateBlocoDto){
        return this.blocosService.create(dto)
    }

    // PUT /blocos/:id - atualiza um bloco pelo id
    @Put(':id')
    update(@Param('id') id : string, @Body() dto:UpdateBlocoDto){
        return this.blocosService.update(Number(id), dto)
    }

    // DELETE /blocos/:id - apaga um bloco pelo id
    @Delete(':id')    
    remove(@Param('id') id:string){
        return this.blocosService.remove(Number(id))
    }
}