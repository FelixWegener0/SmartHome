import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user-create.dto";
import { v4 as uuid } from "uuid";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createDto: UserCreateDto): Promise<string> {
        const newUser = this.userRepository.create({
            ...createDto,
            token: uuid(),
        });
        return (await this.userRepository.save(newUser)).token;
    }

    async getToken(name: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findOne({
            where: { name: name },
        });

        if (user?.password === password) {
            return user.token;
        } else {
            return null;
        }
    }

    async checkToken(token: string): Promise<boolean> {
        const users = await this.userRepository.find();

        users.forEach((user) => {
            if (user.token === token) return true;
        });
        return false;
    }
}
