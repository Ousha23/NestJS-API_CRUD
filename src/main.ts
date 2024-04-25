import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// pour docummenter l'API, on utilisera swagger (npm install --save @nestjs/swagger)
// voir la documentation OPENAPI/CLI Plugin
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Reseau CRUD')
    .setDescription('API Reseau CRUD description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
