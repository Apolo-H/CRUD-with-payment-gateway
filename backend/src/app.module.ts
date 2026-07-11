import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [LoginModule, AddressModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
