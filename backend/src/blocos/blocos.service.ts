import {Injectable, ConflictException} from '@nestjs/common';
import { DiaSemana } from '@prisma/client';
import {PrismaService} from '../../prisma/prisma.service';
import {CreateBlocoDto} from './dto/create-bloco.dto';
import {UpdateBlocoDto} from './dto/update-bloco.dto';
import { BlocosGateway } from './blocos.gateway';

@Injectable()
export class BlocosService {
  constructor(private readonly prisma: PrismaService, private readonly blocosGateway: BlocosGateway) {}

    findAll() {
        return this.prisma.bloco.findMany({
            include: {
                uc: true,
                docente: true,
                turma: true,
                sala: true,
            },
        });
    }

        findOne(id: number) {
            return this.prisma.bloco.findUnique({
                where: { id },
                include: {
                    uc: true,
                    docente: true,
                    turma: true,
                    sala: true,
                },
            });
        }

        async update(id: number, dto: UpdateBlocoDto) {
            const DIAS_SEMANA : DiaSemana[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO']
            const atualizaBloco = await this.prisma.bloco.update({
                where: { id },
                data: {...dto,
                    ...(dto.data ? { data: new Date(dto.data), dia: DIAS_SEMANA[new Date(dto.data).getDay() - 1] } : {}),
                },
                  include: { uc: true, docente: true, turma: true, sala: true },
            });
            this.blocosGateway.emitirBlocoAtualizado(atualizaBloco);
            return atualizaBloco;
        }

        async create(dto: CreateBlocoDto) {
            const DIAS_SEMANA : DiaSemana[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO']
            const novoBloco = await this.prisma.bloco.create({
                data: {
                    uc:{ connect: { id: dto.ucId }},
                    docente:{ connect: { id: dto.docenteId } },
                    turma:{ connect: { id: dto.turmaId } },
                    sala:{ connect: { id: dto.salaId } },
                    tipologia: dto.tipologia,
                    data: new Date(dto.data),
                    dia: DIAS_SEMANA[new Date(dto.data).getDay() - 1],
                    horaInicio: dto.horaInicio,
                    horaFim: dto.horaFim,
                },
                  include: { uc: true, docente: true, turma: true, sala: true },

            })
            this.blocosGateway.emitirBlocoCriado(novoBloco);
            return novoBloco;
        }
        
        async remove(id: number) {
            const apagaBloco = await this.prisma.bloco.delete({
                where: { id },
            });
            this.blocosGateway.emitirBlocoApagado(id);
            return apagaBloco;
        }
    }