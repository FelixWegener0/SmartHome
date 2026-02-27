import { Injectable, MiddlewareConsumer, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import KeycloakConnect from 'keycloak-connect';

@Injectable()
export class KeycloakMiddleware implements NestMiddleware {
    private keycloak: InstanceType<typeof KeycloakConnect>;

    constructor() {
        const memoryStore = new session.MemoryStore();

        this.keycloak = new KeycloakConnect({ store: memoryStore }, {
            realm: 'myrealm',
            'auth-server-url': 'http://localhost:8080/',
            'ssl-required': 'external',
            resource: 'nestjs-backend',
            'verify-token-audience': true, // <-- TS meckert nicht mehr
            credentials: {
                secret: 'DEIN_CLIENT_SECRET'
            },
            'confidential-port': 0
        } as any);
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(this.keycloak.middleware())
            .forRoutes('*');
    }

    getKeycloak() {
        return this.keycloak;
    }
}