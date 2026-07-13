import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'; // 👈 Importe o UseGuards
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {JwtAuthGuard} from 'src/jwt/jwtAuthGuard'
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido no sistema' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() createOrderDto: CreateOrderDto,
  ) {

    return this.orderService.create(user.userId, createOrderDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.orderService.findAll(user.userId);
  }
}