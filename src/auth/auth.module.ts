import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에 설정된 JWT 비밀 키 사용
      signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [],
})
export class AuthModule {}
