import createClient, { Client } from 'openapi-fetch';
import type { paths } from './generated/schema.js';
import { ProblemDetailsError, ProblemDetails } from './utils/errors.js';
import { AuthModule } from './modules/auth.js';
import { PosModule } from './modules/pos.js';
import { InventoryModule } from './modules/inventory.js';
import { LedgerModule } from './modules/ledger.js';

export interface GrandfleetClientOptions {
  baseUrl: string;
  tenantId: string;
  authToken?: string;
  fetch?: typeof globalThis.fetch;
}

export class GrandfleetClient {
  public readonly baseUrl: string;
  public tenantId: string;
  private token?: string;
  public readonly raw: Client<paths>;

  public readonly auth: AuthModule;
  public readonly pos: PosModule;
  public readonly inventory: InventoryModule;
  public readonly ledger: LedgerModule;

  constructor(options: GrandfleetClientOptions) {
    this.baseUrl = options.baseUrl;
    this.tenantId = options.tenantId;
    this.token = options.authToken;

    const customFetch: typeof globalThis.fetch = async (input, init) => {
      const fetchImpl = options.fetch || globalThis.fetch;
      const headers = new Headers(init?.headers);

      if (this.tenantId && !headers.has('X-Tenant-Id')) {
        headers.set('X-Tenant-Id', this.tenantId);
      }
      if (this.token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${this.token}`);
      }
      if (!headers.has('X-Trace-Id')) {
        headers.set('X-Trace-Id', `sdk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
      }

      const response = await fetchImpl(input, { ...init, headers });

      if (!response.ok) {
        let problem: ProblemDetails;
        try {
          problem = (await response.json()) as ProblemDetails;
        } catch {
          problem = {
            status: response.status,
            title: response.statusText || 'HTTP Error',
            detail: await response.text().catch(() => undefined),
          };
        }
        throw new ProblemDetailsError(problem);
      }

      return response;
    };

    this.raw = createClient<paths>({
      baseUrl: this.baseUrl,
      fetch: customFetch,
    });

    this.auth = new AuthModule(this);
    this.pos = new PosModule(this);
    this.inventory = new InventoryModule(this);
    this.ledger = new LedgerModule(this);
  }

  public setAuthToken(token: string | undefined): void {
    this.token = token;
  }

  public getAuthToken(): string | undefined {
    return this.token;
  }
}
