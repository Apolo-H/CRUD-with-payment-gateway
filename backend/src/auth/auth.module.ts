import { Module } from '@nestjs/common';
import { LoginService } from './auth.service';
import { LoginController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/JwtStrategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, PrismaService, JwtStrategy],
})
export class LoginModule {}
