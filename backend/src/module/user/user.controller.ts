import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Body() body): Promise<string | null> {
        const { name, password, permissionLevel } = body;
        return await this.userService.create({
            name,
            password,
            permissionLevel,
        });
    }
}
