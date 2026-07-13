import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEmail,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoginDto {
  @ApiProperty({ example: 'user-uuid-123456', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'João Silva', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ example: '11999998888', required: false })
  @IsOptional()
  @IsString()
  userPhone?: string;

  @ApiProperty({ example: 'joao.silva@email.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email?: string;

  @ApiProperty({ example: 'SenhaSegura123', required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
