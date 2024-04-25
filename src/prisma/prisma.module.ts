import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// il faut rendre le module prisma global
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
