import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  if(process.env.ENABLE_CORS) app.enableCors();

  await app.listen(port, () => {
    console.log(`Backend now Running on Port: ${port}`)
  });
  
}
bootstrap();
