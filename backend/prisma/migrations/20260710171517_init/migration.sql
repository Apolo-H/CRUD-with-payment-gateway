-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pendente', 'Cancelado', 'Concluido');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "address" (
    "address_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address_cep" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_neighborhood" TEXT NOT NULL,
    "address_property_type" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "orders_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "orders_tax" DOUBLE PRECISION NOT NULL,
    "orders_pay_method" TEXT NOT NULL,
    "orders_status" "OrderStatus" NOT NULL DEFAULT 'Pendente',
    "orders_username" TEXT NOT NULL,
    "orders_user_phone" TEXT NOT NULL,
    "orders_delivery_address" TEXT NOT NULL,
    "orders_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orders_stripe_session_id" TEXT,
    "orders_observation" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orders_id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" SERIAL NOT NULL,
    "orders_id" INTEGER NOT NULL,
    "sanity_product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "order_item_complements" (
    "order_item_complement_id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "sanity_complement_id" TEXT NOT NULL,

    CONSTRAINT "order_item_complements_pkey" PRIMARY KEY ("order_item_complement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_email_key" ON "user"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orders_stripe_session_id_key" ON "orders"("orders_stripe_session_id");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orders_id_fkey" FOREIGN KEY ("orders_id") REFERENCES "orders"("orders_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_complements" ADD CONSTRAINT "order_item_complements_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("order_item_id") ON DELETE CASCADE ON UPDATE CASCADE;
