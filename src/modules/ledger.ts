import type { GrandfleetClient } from '../client.js';

export interface LedgerLine {
  account_code: string;
  debit: number;
  credit: number;
}

export class LedgerModule {
  constructor(private client: GrandfleetClient) {}

  public async getAccountBalance(accountCode: string) {
    const response = await this.client.raw.GET('/v1/ledger/accounts/{account_code}/balance', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
        path: { account_code: accountCode },
      },
    });
    return response.data;
  }

  public async postEntry(description: string, lines: LedgerLine[]) {
    const response = await this.client.raw.POST('/v1/ledger/entries', {
      params: {
        header: {
          'X-Tenant-Id': this.client.tenantId,
        },
      },
      body: {
        description,
        lines,
      },
    });
    return response.data;
  }
}
