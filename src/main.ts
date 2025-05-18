import { RestServer } from '@libs/boat';
import { AppModule } from './app';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

RestServer.make(AppModule, { addValidationContainer: true });
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Apply validation to all incoming requests
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}
bootstrap();