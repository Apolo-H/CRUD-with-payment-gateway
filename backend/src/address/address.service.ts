import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        userId,
        addressStreet: createAddressDto.addressStreet,
        addressNumber: createAddressDto.addressNumber,
        addressNeighborhood: createAddressDto.addressNeighborhood,
        addressCep: createAddressDto.addressCep,
        addressPropertyType: createAddressDto.addressPropertyType,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async remove(userId: string, addressId: number) {
    const address = await this.prisma.address.findFirst({
      where: { addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    return this.prisma.address.delete({
      where: { addressId },
    });
  }
}
