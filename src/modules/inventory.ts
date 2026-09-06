import type { GrandfleetClient } from '../client.js';

export class InventoryModule {
  constructor(private client: GrandfleetClient) {}

  public async getStock(sku: string) {
    const response = await this.client.raw.GET('/v1/inventory/stock/{sku}', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
        path: { sku },
      },
    });
    return response.data;
  }

  public async recordMovement(sku: string, warehouseId: string, movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER', quantity: number) {
    const response = await this.client.raw.POST('/v1/inventory/movements', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        sku,
        warehouse_id: warehouseId,
        movement_type: movementType,
        quantity,
      },
    });
    return response.data;
  }
}
