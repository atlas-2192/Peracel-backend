declare const _default: () => {
    port: number;
    database: {
        url: string;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiration: string;
        refreshExpiration: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    stripe: {
        secretKey: string;
        webhookSecret: string;
    };
    frontend: {
        url: string;
    };
};
export default _default;
