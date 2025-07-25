import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { getClientIp } from "./shared.functions";

@Injectable()
export class AuthGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers;

        if (authHeader.host !== process.env.ALLOW_ORIGIN) {
            return false;
        }

        if (authHeader.token === process.env.BACKEND_TOKEN) {
            return true;
        } else {
            console.log(`${new Date()} - AuthGuard log try to connect to backend with ip: ${getClientIp(request)} rejected wrong token`);
            return false;
        }
    }

}
