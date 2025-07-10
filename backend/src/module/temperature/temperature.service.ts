import { Injectable } from "@nestjs/common";
import { Temperature } from "./entities/temperature.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, Repository } from 'typeorm';
import { TemperatureResponseDto } from "./dto/temperature-response.dto";
import { TemperatureCreateDto } from "./dto/temperature-create.dto";

export interface ProcessedDataType {
    room: string;
    date: string;
    averageTemperature: number;
    averageHumidity: number;
}

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
            take: limit || 1000
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

    async getLast24HourData(): Promise<TemperatureResponseDto[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 1);

        return this.temperatureRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async calcDataFromLastMonth(): Promise<ProcessedDataType[]> {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        return await this.temperatureRepository.query(
            `
                SELECT
                    room,
                    TO_CHAR("createdAt"::date, 'YYYY-MM-DD') AS date,
                ROUND(AVG(temperature)::numeric, 2) AS "averageTemperature",
                ROUND(AVG(humidity)::numeric, 2) AS "averageHumidity"
                FROM temperature
                WHERE "createdAt" BETWEEN $1 AND $2
                GROUP BY room, date
                ORDER BY room, date;
            `,
            [thirtyDaysAgo.toISOString(), now.toISOString()]
        );
    }

}
