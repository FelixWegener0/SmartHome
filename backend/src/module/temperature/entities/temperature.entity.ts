import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Temperature {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    room: string;

    @Column("double precision")
    humidity: number;

    @Column("double precision")
    temperature: number;

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
