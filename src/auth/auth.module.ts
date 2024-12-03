import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { AuthGoogleService } from './auth.google.service';
import { AuthKakaoService } from './auth.kakao.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에 설정된 JWT 비밀 키 사용
      signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
    }),
    HttpModule,
    ConfigModule,
    UtilsModule,
  ],
  providers: [AuthService, AuthResolver, AuthGoogleService, AuthKakaoService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
