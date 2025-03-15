import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { TemperatureService } from "./temperature.service";
import { TemperatureCreateDto } from "./dto/temperature-create.dto";
import { AuthGuard } from "src/core/auth/auth.guard";

@Controller('temp')
export class TemperatureController {

    constructor(private temperatureService: TemperatureService) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
        return await this.temperatureService.findAll();
    }

    @Post()
    async create(@Body() createNew: TemperatureCreateDto) {
        return await this.temperatureService.create(createNew);
    }

    @UseGuards(AuthGuard)
    @Post('/findByRoomAll')
    async findByRoomAll(@Body() body) {
        return await this.temperatureService.findAllbyRoom(body.room);
    }

    @UseGuards(AuthGuard)
    @Get('/latest')
    async findLatest() {
        return await this.temperatureService.findLatest();
    }

    @UseGuards(AuthGuard)
    @Post('/findByRoomLatest')
    async findLatestByRoom(@Body() body) {
        return await this.temperatureService.findLatestByRoom(body.room);
    }

    @UseGuards(AuthGuard)
    @Post('/removeOne')
    async removeOne(@Body() body) {
        await this.temperatureService.removeOne(body.id);
        return null;
    }

    @UseGuards(AuthGuard)
    @Get('/removeAll')
    async removeAll() {
        this.temperatureService.removeAll();
        return null;
    }
}
