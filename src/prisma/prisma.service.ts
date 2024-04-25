import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
// il faut rendre le module prisma global
@Injectable()
export class PrismaService extends PrismaClient{
    constructor( configService : ConfigService){
        super({
            datasources : {
                db : {
                    // on doit récup notre URL de la BDD (variable d'env) on doit donc installer : npm i --save @nestjs/config puis aller sur le module principal (app.module.ts)
                    url : configService.get("DATABASE_URL"),
                },
            },
        });
    }
}
