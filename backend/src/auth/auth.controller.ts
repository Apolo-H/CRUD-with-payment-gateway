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
import { UpdateLoginDto } from './dto/update-auth.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  register(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.register(createLoginDto);
  }

  @Post('login')
  login(@Body() loginDto: { email: string; password: string }) {
    return this.loginService.login(loginDto);
  }

}
