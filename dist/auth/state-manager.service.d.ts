import { Role } from 'src/users/dto/create-user.request';
export declare class StateManagerService {
    private stateMap;
    setRole(state: string, role: Role): void;
    getRole(state: string): Role | undefined;
    clearState(state: string): void;
}
