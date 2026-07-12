import { PrismaClient, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando a criação de dados falsos...');

  // 1. Limpar o banco antes de inserir (evita duplicar e-mails ao rodar de novo)
  await prisma.orderItemComplement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123', 10);

  const userIdMock = '01909e73-b36b-7ac3-8000-000000000001';
  
  const user = await prisma.user.create({
    data: {
      userId: userIdMock,
      userName: 'Angelo',
      userEmail: 'angelo@teste.com',
      userPhone: '12982288501',
      userPassword: hashedPassword,
    },
  });
  console.log(`👤 Usuário criado: ${user.userEmail}`);

  const address1 = await prisma.address.create({
    data: {
      userId: user.userId,
      addressStreet: 'Avenida Paulista',
      addressNumber: '1000',
      addressNeighborhood: 'Bela Vista',
      addressCep: '01310-100',
      addressPropertyType: 'Trabalho',
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: user.userId,
      addressStreet: 'Rua das Flores',
      addressNumber: '45',
      addressNeighborhood: 'Jardins',
      addressCep: '01420-000',
      addressPropertyType: 'Casa',
    },
  });
  console.log('📍 2 Endereços criados com sucesso!');

  const deliveryAddressStr = `${address1.addressStreet}, Nº ${address1.addressNumber} - ${address1.addressNeighborhood}, CEP: ${address1.addressCep} (${address1.addressPropertyType})`;

  const order = await prisma.order.create({
    data: {
      userId: user.userId,
      ordersTax: 7.50,
      ordersPayMethod: 'Pix',
      ordersStatus: OrderStatus.Pendente,
      ordersUsername: user.userName,
      ordersUserPhone: user.userPhone,
      ordersDeliveryAddress: deliveryAddressStr,
      ordersObservation: 'Retirar a cebola do hambúrguer, por favor.',

      items: {
        create: [
          {
            sanityProductId: 'sanity_prod_monster_burger_123', 
            quantity: 1,
            priceAtPurchase: 38.90,
            orderItemComplements: {
              create: [
                { sanityComplementId: 'sanity_comp_bacon_extra' },
                { sanityComplementId: 'sanity_comp_cheddar_duplo' }
              ]
            }
          },
          {
            sanityProductId: 'sanity_prod_batata_frita_456',
            quantity: 1,
            priceAtPurchase: 14.00

          }
        ]
      }
    },
    include: {
      items: {
        include: {
          orderItemComplements: true
        }
      }
    }
  });

  console.log(`🍔 Pedido fake #${order.ordersId} gerado com sucesso!`);
  console.log('✨ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });