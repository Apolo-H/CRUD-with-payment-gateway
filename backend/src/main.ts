import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('Documentação das rotas do sistema de pedidos e delivery')
    .setVersion('1.0')
    .addBearerAuth() // Opcional: Adiciona o botão de Token JWT se você usar autenticação
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:8080'];
  app.enableCors({
    origin: allowedOrigins,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
