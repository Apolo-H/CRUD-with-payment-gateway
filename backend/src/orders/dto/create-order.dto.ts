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


export class CreateOrderItemComplementDto {
  @ApiProperty({ 
    example: 'comp-bacon-extra-456', 
    description: 'ID do complemento vindo do Sanity CMS' 
  })
  @IsString({ message: 'O ID do complemento deve ser um texto.' })
  sanityComplementId!: string;
}

// ==========================================
// 2. ITENS DO PEDIDO
// ==========================================
export class CreateOrderItemDto {
  @ApiProperty({ 
    example: 'prod-hamburguer-123', 
    description: 'ID do produto vindo do Sanity CMS' 
  })
  @IsString({ message: 'O ID do produto deve ser um texto.' })
  sanityProductId!: string;

  @ApiProperty({ example: 2, description: 'Quantidade deste item no carrinho' })
  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @Min(1, { message: 'A quantidade mínima deve ser 1.' })
  quantity!: number;

  @ApiProperty({ 
    example: 34.90, 
    description: 'Preço unitário ou calculado do item no momento da compra' 
  })
  @IsNumber({}, { message: 'O preço deve ser um número decimal/float.' })
  priceAtPurchase!: number;

  @ApiProperty({ 
    type: [CreateOrderItemComplementDto], 
    required: false, 
    description: 'Lista de adicionais escolhidos para este produto' 
  })
  @IsOptional()
  @IsArray({ message: 'Os complementos devem ser enviados em formato de lista (array).' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemComplementDto)
  complements?: CreateOrderItemComplementDto[];
}

// ==========================================
// 3. CRIAÇÃO DE PEDIDO
// ==========================================
export class CreateOrderDto {
  @ApiProperty({ example: 'user-uuid-123456', description: 'ID único do usuário' })
  @IsString({ message: 'O userId deve ser uma string válida.' })
  userId!: string;

  @ApiProperty({ example: 1, description: 'ID numérico do endereço de entrega' })
  @IsNumber({}, { message: 'O addressId deve ser um número inteiro.' })
  addressId!: number;

  @ApiProperty({ example: 'Cartão de Crédito', description: 'Método de pagamento escolhido' })
  @IsString({ message: 'O método de pagamento deve ser um texto.' })
  ordersPayMethod!: string;

  @ApiProperty({ 
    example: 'Sem cebola no hambúrguer principal.', 
    required: false, 
    description: 'Observações gerais do cliente sobre o pedido' 
  })
  @IsOptional()
  @IsString({ message: 'A observação deve ser um texto.' })
  ordersObservation?: string;

  @ApiProperty({ 
    type: [CreateOrderItemDto], 
    description: 'Lista de produtos/itens adicionados ao carrinho' 
  })
  @IsArray({ message: 'Os itens do pedido devem ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}