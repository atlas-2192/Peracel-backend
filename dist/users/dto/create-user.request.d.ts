export declare enum Role {
    HOST = "HOST",
    INFLUENCER = "INFLUENCER"
}
export declare enum RegisterType {
    EMAIL = "EMAIL",
    GOOGLE = "GOOGLE"
}
export declare class CreateUserRequest {
    registerType: RegisterType;
    googleId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
}
