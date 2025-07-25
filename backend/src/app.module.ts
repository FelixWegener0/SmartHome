import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemperatureModule } from "./module/temperature/temperature.module";
import { Temperature } from "./module/temperature/entities/temperature.entity";
import { UserModule } from "./module/user/user.module";
import { User } from "./module/user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [],
            useFactory: () => ({
                type: "postgres",
                host: process.env.DATABASE_HOST,
                port: getPort(),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [Temperature],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [],
        }),
        TemperatureModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

function getPort(): number {
    const port = process.env.DATABASE_PORT;

    if (typeof port === "number") {
        return port;
    } else {
        return 5432;
    }
}
