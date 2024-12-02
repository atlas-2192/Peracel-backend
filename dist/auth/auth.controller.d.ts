import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    signup(body: {
        email: string;
        password: string;
        name: string;
        role: UserRole;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    refreshTokens(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
