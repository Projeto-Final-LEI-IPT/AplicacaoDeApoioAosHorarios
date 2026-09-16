import {Module} from '@nestjs/common'
import { PrismaModule } from "../../prisma/prisma.module";
import { BlocosController } from "./blocos.controller";
import { BlocosService } from "./blocos.service";

@Module({
    imports: [PrismaModule],
    controllers: [BlocosController],
    providers: [BlocosService],
})
export class BlocosModule{}