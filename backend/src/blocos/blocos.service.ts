import {Injectable, ConflictException} from '@nestjs/common';
import { DiaSemana } from '@prisma/client';
import {PrismaService} from '../../prisma/prisma.service';
import {CreateBlocoDto} from './dto/create-bloco.dto';
import {UpdateBlocoDto} from './dto/update-bloco.dto';

@Injectable()
export class BlocosService {
  constructor(private readonly prisma: PrismaService) {}

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

        update(id: number, updateBlocoDto: UpdateBlocoDto) {
            return this.prisma.bloco.update({
                where: { id },
                data: updateBlocoDto,
            });
        }

        async create(dto: CreateBlocoDto) {
            const DIAS_SEMANA : DiaSemana[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO']
            return this.prisma.bloco.create({
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
                }
            });
        }
        
        remove(id: number) {
            return this.prisma.bloco.delete({
                where: { id },
            });
        }
    }