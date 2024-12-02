import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signup(email: string, password: string, name: string, role: UserRole): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    handleGoogleAuth(profile: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private getTokens;
    private updateRefreshToken;
}
