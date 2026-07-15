import { Module } from '@nestjs/common';
import { StripeWebhookModule } from './webhooks/stripe.module';

@Module({
  imports: [StripeWebhookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
