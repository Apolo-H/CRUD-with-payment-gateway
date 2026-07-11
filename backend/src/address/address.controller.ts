import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(user.userId, createAddressDto);
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string }) {
    return this.addressService.findAll(user.userId);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.addressService.remove(user.userId, +id);
  }
}
