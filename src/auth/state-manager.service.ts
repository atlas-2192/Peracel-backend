import { Injectable } from '@nestjs/common';
import { Role } from 'src/users/dto/create-user.request';

@Injectable()
export class StateManagerService {
  private stateMap = new Map<string, Role>();

  setRole(state: string, role: Role) {
    this.stateMap.set(state, role);
  }

  getRole(state: string): Role | undefined {
    return this.stateMap.get(state);
  }

  clearState(state: string) {
    this.stateMap.delete(state);
  }
}
