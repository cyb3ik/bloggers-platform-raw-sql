import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/exception-filters/http.exception.filter';
import { CoreConfig } from './core/core.config';
import cookieParser from 'cookie-parser';
import { UUIDValidationPipe } from './core/pipes/uuid-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  app.setGlobalPrefix('bloggers-platform/api')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const errorsRes = errors.map(e => {
          for (let key of Object.keys(e.constraints)) {
            return {
              message: e.constraints[key],
              field: e.property
            }
          }
        })
        throw new BadRequestException(errorsRes)
      }
    }),
    new UUIDValidationPipe())

  app.useGlobalFilters(new HttpExceptionFilter())

  app.use(cookieParser())

  const port = coreConfig.port

  await app.listen(port, '0.0.0.0')
}

export default bootstrap()
