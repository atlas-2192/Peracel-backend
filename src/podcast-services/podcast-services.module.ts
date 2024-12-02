import { Module } from '@nestjs/common';
import { PodcastServicesService } from './podcast-services.service';
import { PodcastServicesController } from './podcast-services.controller';

@Module({
  providers: [PodcastServicesService],
  controllers: [PodcastServicesController],
  exports: [PodcastServicesService],
})
export class PodcastServicesModule {}