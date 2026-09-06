import type { GrandfleetClient } from '../client.js';
import type { components } from '../generated/schema.js';

export type CartItem = components['schemas']['CartItem'];
export type PaymentItem = components['schemas']['PaymentItem'];

export class PosModule {
  constructor(private client: GrandfleetClient) {}

  public async calculateCart(items: CartItem[]) {
    const response = await this.client.raw.POST('/v1/pos/calculate-cart', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        items,
      },
    });
    return response.data;
  }

  public async checkout(orderNumber: string, items: CartItem[], payments: PaymentItem[], documentType = '01', customerName?: string, customerId?: string) {
    const response = await this.client.raw.POST('/v1/pos/checkout', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        order_number: orderNumber,
        document_type: documentType,
        customer_name: customerName,
        customer_id: customerId,
        items,
        payments,
      },
    });
    return response.data;
  }

  public async refund(originalOrderId: string, reason: string, items: CartItem[]) {
    const response = await this.client.raw.POST('/v1/pos/refund', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        original_order_id: originalOrderId,
        reason,
        items,
      },
    });
    return response.data;
  }
}
