"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_service_1 = require("./users.service");
const client_1 = require("@prisma/client");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, updateData) {
        return this.usersService.updateProfile(req.user.id, updateData);
    }
    async findInfluencers(category, rating, minPrice, maxPrice) {
        const searchParams = {};
        if (category)
            searchParams.category = category;
        if (rating)
            searchParams.rating = Number(rating);
        if (minPrice || maxPrice) {
            searchParams.priceRange = {
                min: minPrice ? Number(minPrice) : 0,
                max: maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER,
            };
        }
        return this.usersService.findInfluencers(searchParams);
    }
    async getInfluencerProfile(id) {
        return this.usersService.getInfluencerProfile(id);
    }
    async getHostProfile(id) {
        return this.usersService.getHostProfile(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('influencers'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('rating')),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findInfluencers", null);
__decorate([
    (0, common_1.Get)('influencers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInfluencerProfile", null);
__decorate([
    (0, common_1.Get)('hosts/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.INFLUENCER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getHostProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map