import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UserResolver } from './user.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { PointModule } from 'src/point/point.module';

@Module({
  imports: [
    PrismaModule,
    UtilsModule,
    forwardRef(() => AuthModule),
    PointModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
