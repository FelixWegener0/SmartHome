import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temperature } from './entities/temperature.entity';
import { TemperatureService } from './temperature.service';
import { TemperatureController } from './temperature.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Temperature])],
    providers: [TemperatureService],
    controllers: [TemperatureController],
})
export class TemperatureModule {}
