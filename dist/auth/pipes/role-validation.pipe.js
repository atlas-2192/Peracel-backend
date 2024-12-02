"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const create_user_request_1 = require("../../users/dto/create-user.request");
let RoleValidationPipe = class RoleValidationPipe {
    transform(value) {
        if (!Object.values(create_user_request_1.Role).includes(value)) {
            throw new common_1.BadRequestException('Invalid Role provided');
        }
        return value;
    }
};
exports.RoleValidationPipe = RoleValidationPipe;
exports.RoleValidationPipe = RoleValidationPipe = __decorate([
    (0, common_1.Injectable)()
], RoleValidationPipe);
//# sourceMappingURL=role-validation.pipe.js.map