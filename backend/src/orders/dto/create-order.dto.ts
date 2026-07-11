export class CreateOrderItemComplementDto {
  sanityComplementId!: string;
}

export class CreateOrderItemDto {
  sanityProductId!: string;
  quantity!: number;
  priceAtPurchase!: number; // ⚠️ Temporário até termos o Sanity integrado!
  complements?: CreateOrderItemComplementDto[];
}

export class CreateOrderDto {
  addressId!: number; // Envia o ID para o back-end buscar o endereço real
  ordersPayMethod!: string;
  ordersObservation?: string;
  items!: CreateOrderItemDto[];
}