import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsEmail, 
  ValidateNested, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {

  @ApiProperty({ example: '01909e73-b36b-7ac3-8000-000000000001' })
  @IsString({ message: 'A usuário é obrigatório.' })
  userId!: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString({ message: 'A rua é obrigatória.' })
  addressStreet!: string;

  @ApiProperty({ example: '1000' })
  @IsString({ message: 'O número é obrigatório (mesmo se for "S/N").' })
  addressNumber!: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString({ message: 'O bairro é obrigatório.' })
  addressNeighborhood!: string;

  @ApiProperty({ example: '01311-100' })
  @IsString({ message: 'O CEP é obrigatório.' })
  addressCep!: string;

  @ApiProperty({ example: 'Apartamento', description: 'Ex: Casa, Apartamento, Comercial' })
  @IsString({ message: 'O tipo de propriedade é obrigatório.' })
  addressPropertyType!: string;
}