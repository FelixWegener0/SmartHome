import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { getClientIp } from "./shared.functions";

@Injectable()
export class NetworkGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const ip = getClientIp(request);

        if (ip === process.env.ALLOWED_NETWORK_IP) {
            return true;
        } else {
            console.log(`${new Date()} - try to post data with ip: ${ip} was rejected`);
            return false;
        }
    }
}
