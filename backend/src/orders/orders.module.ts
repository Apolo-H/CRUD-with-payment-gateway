import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoginModule } from 'src/auth/auth.module';
import { SanityModule } from 'src/sanity/sanity.module';

@Module({
  imports: [PrismaModule, LoginModule, SanityModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}