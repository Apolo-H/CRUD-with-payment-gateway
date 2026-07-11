import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from 'generated/prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // 1. Busca os dados do usuário para salvar o histórico no pedido
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2. Busca e valida se o endereço existe e pertence a este usuário
    const address = await this.prisma.address.findFirst({
      where: { addressId: createOrderDto.addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found or invalid');

    // 3. Formata a string de entrega como o seu schema exige
    const deliveryAddressStr = `${address.addressStreet}, Nº ${address.addressNumber} - ${address.addressNeighborhood}, CEP: ${address.addressCep}`;

    // 4. Salva o pedido, os itens e os complementos de uma vez só!
    return this.prisma.order.create({
      data: {
        userId,
        ordersTax: 7.00, // Taxa fixa de entrega de teste (pode ser dinâmica no futuro)
        ordersPayMethod: createOrderDto.ordersPayMethod,
        ordersStatus: OrderStatus.Pendente,
        ordersUsername: user.userName,
        ordersUserPhone: user.userPhone,
        ordersDeliveryAddress: deliveryAddressStr,
        ordersObservation: createOrderDto.ordersObservation,
        items: {
          create: createOrderDto.items.map((item) => ({
            sanityProductId: item.sanityProductId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
            orderItemComplements: {
              create: item.complements?.map((comp) => ({
                sanityComplementId: comp.sanityComplementId,
              })) || [],
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            orderItemComplements: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    // Retorna o histórico de pedidos do usuário logado
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { ordersCreatedAt: 'desc' },
      include: {
        items: { include: { orderItemComplements: true } },
      },
    });
  }
}