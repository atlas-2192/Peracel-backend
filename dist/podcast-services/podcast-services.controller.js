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
exports.PodcastServicesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const podcast_services_service_1 = require("./podcast-services.service");
const create_service_dto_1 = require("./dto/create-service.dto");
const update_service_dto_1 = require("./dto/update-service.dto");
const client_1 = require("@prisma/client");
let PodcastServicesController = class PodcastServicesController {
    constructor(podcastServicesService) {
        this.podcastServicesService = podcastServicesService;
    }
    async create(req, createServiceDto) {
        return this.podcastServicesService.create(req.user.id, createServiceDto);
    }
    async findAll(category, minPrice, maxPrice, meetingType) {
        return this.podcastServicesService.findAll({
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            meetingType,
        });
    }
    async findOne(id) {
        return this.podcastServicesService.findOne(id);
    }
    async update(req, id, updateServiceDto) {
        return this.podcastServicesService.update(id, req.user.id, updateServiceDto);
    }
    async delete(req, id) {
        await this.podcastServicesService.delete(id, req.user.id);
        return { message: 'Service deleted successfully' };
    }
};
exports.PodcastServicesController = PodcastServicesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INFLUENCER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], PodcastServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('meetingType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], PodcastServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastServicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INFLUENCER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_service_dto_1.UpdateServiceDto]),
    __metadata("design:returntype", Promise)
], PodcastServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.INFLUENCER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PodcastServicesController.prototype, "delete", null);
exports.PodcastServicesController = PodcastServicesController = __decorate([
    (0, common_1.Controller)('podcast-services'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [podcast_services_service_1.PodcastServicesService])
], PodcastServicesController);
//# sourceMappingURL=podcast-services.controller.js.map