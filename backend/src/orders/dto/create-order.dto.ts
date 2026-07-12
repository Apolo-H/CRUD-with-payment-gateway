export class CreateOrderItemComplementDto {
  sanityComplementId!: string;
}

export class CreateOrderItemDto {
  sanityProductId!: string;
  quantity!: number;
  priceAtPurchase!: number;
  complements?: CreateOrderItemComplementDto[];
}

export class CreateOrderDto {
  userId!: string
  addressId!: number; 
  ordersPayMethod!: string;
  ordersObservation?: string;
  items!: CreateOrderItemDto[];
}