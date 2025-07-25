import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
    type: "postgres",
    username: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    migrations: [],
    synchronize: false,
    migrationsTableName: "_migrations",
    migrationsRun: true,
    logging: "all",
    logger: "advanced-console",
});
