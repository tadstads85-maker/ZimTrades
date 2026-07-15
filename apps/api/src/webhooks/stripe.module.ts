import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe.controller';

@Module({
  controllers: [StripeWebhookController],
  providers: [],
})
export class StripeWebhookModule {}
