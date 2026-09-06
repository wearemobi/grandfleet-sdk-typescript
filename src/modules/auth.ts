import type { GrandfleetClient } from '../client.js';

export class AuthModule {
  constructor(private client: GrandfleetClient) {}

  public async login(tenantId: string, username: string, pin: string) {
    const response = await this.client.raw.POST('/v1/auth/login', {
      body: {
        tenant_id: tenantId,
        username,
        pin,
      },
    });
    if (response.data?.token) {
      this.client.setAuthToken(response.data.token);
    }
    return response.data;
  }

  public async createOperator(username: string, name: string, initialPin: string, roles: string[]) {
    const response = await this.client.raw.POST('/v1/auth/operators', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        username,
        name,
        initial_pin: initialPin,
        roles,
      },
    });
    return response.data;
  }

  public async updateOperatorStatus(id: number, status: 'ACTIVE' | 'INACTIVE' | 'LOCKED') {
    const response = await this.client.raw.PATCH('/v1/auth/operators/{id}/status', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
        path: { id },
      },
      body: {
        status,
      },
    });
    return response.data;
  }

  public async rotateCredential(currentPin: string, newPin: string) {
    const response = await this.client.raw.POST('/v1/auth/credentials/rotate', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        current_pin: currentPin,
        new_pin: newPin,
      },
    });
    return response.data;
  }

  public async listEvents(limit = 50) {
    const response = await this.client.raw.GET('/v1/auth/events', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
        query: {
          limit,
        },
      },
    });
    return response.data;
  }
}
