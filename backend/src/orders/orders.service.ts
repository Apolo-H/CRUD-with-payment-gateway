import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { SanityService } from 'src/sanity/sanity.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sanityService: SanityService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    const address = await this.prisma.address.findFirst({
      where: { addressId: createOrderDto.addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found or invalid');

    const deliveryAddressStr = `${address.addressStreet}, Nº ${address.addressNumber} - ${address.addressNeighborhood}, CEP: ${address.addressCep}`;

    if (!createOrderDto.items || !Array.isArray(createOrderDto.items)) {
      throw new NotFoundException(
        'O carrinho de compras (items) está vazio ou é inválido.',
      );
    }

    const itemsToCreate: any[] = [];

    for (const item of createOrderDto.items) {
      const sanityProduct = await this.sanityService.getProductWithComplements(
        item.sanityProductId,
      );
      if (!sanityProduct) {
        throw new NotFoundException(
          `Produto com ID ${item.sanityProductId} não existe no catálogo.`,
        );
      }

      let finalPrice = sanityProduct.price;
      const complementsData: any[] = [];

      if (item.complements && item.complements.length > 0) {
        for (const comp of item.complements) {
          const realComplement = sanityProduct.complements?.find(
            (c) => c._id === comp.sanityComplementId,
          );

          if (!realComplement) {
            throw new NotFoundException(
              `O adicional ${comp.sanityComplementId} não é válido para o produto ${sanityProduct.name}.`,
            );
          }

          finalPrice += realComplement.price;
          complementsData.push({
            sanityComplementId: comp.sanityComplementId,
          });
        }
      }

      itemsToCreate.push({
        sanityProductId: item.sanityProductId,
        quantity: item.quantity,
        priceAtPurchase: finalPrice,
        orderItemComplements: {
          create: complementsData,
        },
      });
    }

    return this.prisma.order.create({
      data: {
        userId: user.userId,
        ordersTax: 7.0,
        ordersPayMethod: createOrderDto.ordersPayMethod,
        ordersStatus: OrderStatus.Pendente,
        ordersUsername: user.userName,
        ordersUserPhone: user.userPhone,
        ordersDeliveryAddress: deliveryAddressStr,
        ordersObservation: createOrderDto.ordersObservation,
        items: {
          create: itemsToCreate,
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
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { ordersCreatedAt: 'desc' },
      include: {
        items: { include: { orderItemComplements: true } },
      },
    });
  }
}
