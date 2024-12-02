import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { StripeService } from '../stripe/stripe.service';

@Module({
  providers: [BookingsService, StripeService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}