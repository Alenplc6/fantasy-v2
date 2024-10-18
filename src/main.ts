import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // this handle the validation
  app.useGlobalPipes(new ValidationPipe());

  // this will add a global prefix to the system
  // app.setGlobalPrefix('api', { exclude: ['queues'] });

  // this will add api versioning to the system
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //this will allow as to pass the cors policy
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  //this is the setup of the swagger module
  const config = new DocumentBuilder()
    .setTitle('Alen Fantasy Football Documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // this is the url for the swagger documents
  SwaggerModule.setup('docs', app, document);

  //this is to start listening of the server
  await app.listen(3000, async () =>
    console.log(`Server is listening on http://localhost:4000`),
  );
}
bootstrap();
