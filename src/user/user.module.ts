import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaModule, UtilsModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
