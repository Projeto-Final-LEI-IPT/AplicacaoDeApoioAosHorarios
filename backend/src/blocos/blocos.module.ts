import {Module} from '@nestjs/common'
import { PrismaModule } from "../../prisma/prisma.module";
import { BlocosController } from "./blocos.controller";
import { BlocosService } from "./blocos.service";
import { BlocosGateway } from './blocos.gateway'


@Module({
    imports: [PrismaModule],
    controllers: [BlocosController],
    providers: [BlocosService, BlocosGateway],
})
export class BlocosModule{}