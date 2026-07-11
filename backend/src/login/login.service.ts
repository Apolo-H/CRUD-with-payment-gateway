import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createLoginDto: CreateLoginDto) {
    if (!createLoginDto.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    if (!createLoginDto.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    if (!createLoginDto.userPhone) {
      throw new HttpException('Phone is required', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { userEmail: createLoginDto.email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const CryptPassword = await bcrypt.hash(createLoginDto.password, 10);

    const CreateUser = await this.prisma.user.create({
      data: {
        userId: uuidv7(),
        userEmail: createLoginDto.email,
        userPassword: CryptPassword,
        userName: createLoginDto.userName ?? '',
        userPhone: createLoginDto.userPhone ?? '',
      },
    });
    const { userPassword, ...result } = CreateUser;
    return result;
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { userEmail: loginDto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.userPassword,
    );

    const payload = { userId: user.userId, email: user.userEmail };

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const Accesstoken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return {
      token: Accesstoken,
      user: {
        id: user.userId,
        email: user.userEmail,
        name: user.userName,
        phone: user.userPhone,
      },
    };
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
