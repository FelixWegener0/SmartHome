import { Injectable } from "@nestjs/common";
import { Temperature } from "./entities/temperature.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, Repository } from 'typeorm';
import { TemperatureResponseDto } from "./dto/temperature-response.dto";
import { TemperatureCreateDto } from "./dto/temperature-create.dto";

@Injectable()
export class TemperatureService {
    
    constructor(
        @InjectRepository(Temperature)
        private temperatureRepository: Repository<Temperature>,
    ) {}

    async findAll(limit?: number): Promise<TemperatureResponseDto[]> {
        return await this.temperatureRepository.find({
            where: {},
            order: { createdAt: 'DESC' },
            take: limit || 300
        });
    }

    async create(createDto: TemperatureCreateDto): Promise<TemperatureResponseDto> {
        const newTemperatureData = this.temperatureRepository.create({...createDto, createdAt: new Date()});
        return await this.temperatureRepository.save(newTemperatureData);
    }

    async findLatest(): Promise<TemperatureResponseDto | null> {
        return await this.temperatureRepository.findOne({
            where: {},
            order: { createdAt: 'DESC' }
        });
    }

    async findAllbyRoom(room: string, limit?: number): Promise<TemperatureResponseDto[] | null> {
        return await this.temperatureRepository.find({
            where: { room: room },
            order: { createdAt: 'DESC' },
            take: limit
        });
    }

    async findLatestByRoom(room: string): Promise<TemperatureResponseDto | null> {
        return await this.temperatureRepository.findOne({
            where: { room: room },
            order: { createdAt: 'DESC' }
        });
    }

    async removeOne(id: string): Promise<void> {
        await this.temperatureRepository.delete(id);
    }
    
    async removeAll(): Promise<void> {
        const result = await this.temperatureRepository.find();

        result.forEach((entry) => {
            this.temperatureRepository.delete(entry.id);
        });
    }

    async removeByDate() {
        const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
        await this.temperatureRepository.delete({
            createdAt: LessThan(cutoffDate),
        });
    }

    async getAmountOfEntry(): Promise<number> {
        return await this.temperatureRepository.count();
    }

  async getTodayData(): Promise<TemperatureResponseDto[]> {
      const now = new Date();

      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      return this.temperatureRepository.find({
          where: {
              createdAt: Between(startOfDay, endOfDay),
          },
          order: {
              createdAt: 'DESC',
          },
      });
  }

}
