import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('VrealSoft test task ')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('NEST')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
