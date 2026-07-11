import { PrismaClient, OrderStatus } from '../generated/prisma/client'; // ajuste o caminho se necessário
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

  // 2. Criar Senha Criptografada para o usuário de teste
  const hashedPassword = await bcrypt.hash('12345678', 10);

  // 3. Criar o Usuário (Usando um UUID mockado para o userId)
  const userIdMock = '01909e73-b36b-7ac3-8000-000000000001';
  
  const user = await prisma.user.create({
    data: {
      userId: userIdMock,
      userName: 'Carlos Silva (Cliente de Teste)',
      userEmail: 'carlos@teste.com',
      userPhone: '11999998888',
      userPassword: hashedPassword,
    },
  });
  console.log(`👤 Usuário criado: ${user.userEmail}`);

  // 4. Criar Endereços para este usuário
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

  // 5. Criar um Pedido completo (com itens e complementos do Sanity)
  // Simulando que o cliente escolheu o endereço 1 para a entrega
  const deliveryAddressStr = `${address1.addressStreet}, Nº ${address1.addressNumber} - ${address1.addressNeighborhood}, CEP: ${address1.addressCep} (${address1.addressPropertyType})`;

  const order = await prisma.order.create({
    data: {
      userId: user.userId,
      ordersTax: 7.50, // Taxa de entrega
      ordersPayMethod: 'Pix',
      ordersStatus: OrderStatus.Pendente,
      ordersUsername: user.userName,
      ordersUserPhone: user.userPhone,
      ordersDeliveryAddress: deliveryAddressStr,
      ordersObservation: 'Retirar a cebola do hambúrguer, por favor.',
      // Criando os itens e sub-itens na mesma transação!
      items: {
        create: [
          {
            sanityProductId: 'sanity_prod_monster_burger_123', // ID que viria do Sanity
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
            // Sem complementos neste item
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