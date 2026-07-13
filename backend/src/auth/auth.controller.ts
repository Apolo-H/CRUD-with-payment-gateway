import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoginService } from './auth.service';
import { CreateLoginDto } from './dto/create-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Autenticação')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  register(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.register(createLoginDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'entra com o usuário no sistema' })
  login(@Body() loginDto: { email: string; password: string }) {
    return this.loginService.login(loginDto);
  }

}
