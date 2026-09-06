import { describe, it, expect, vi } from 'vitest';
import { GrandfleetClient } from '../src/client.js';

describe('GrandfleetClient', () => {
  it('injects tenant-id and trace-id headers on outgoing requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const client = new GrandfleetClient({
      baseUrl: 'http://localhost:8080',
      tenantId: 'tenant_cr_100',
      authToken: 'test_token_123',
      fetch: mockFetch,
    });

    await client.raw.GET('/healthz');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0];
    const headers = init.headers as Headers;

    expect(headers.get('X-Tenant-Id')).toBe('tenant_cr_100');
    expect(headers.get('Authorization')).toBe('Bearer test_token_123');
    expect(headers.get('X-Trace-Id')).toMatch(/^sdk-/);
  });

  it('exposes ergonomic domain facades (auth, pos, inventory, ledger)', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ sku: 'PROD-01', quantity: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const client = new GrandfleetClient({
      baseUrl: 'http://localhost:8080',
      tenantId: 'tenant_sv_01',
      authToken: 'jwt_secret_token',
      fetch: mockFetch,
    });

    expect(client.auth).toBeDefined();
    expect(client.pos).toBeDefined();
    expect(client.inventory).toBeDefined();
    expect(client.ledger).toBeDefined();

    // Verify calling through facade works seamlessly
    const stock = await client.inventory.getStock('PROD-01');
    expect(stock).toEqual({ sku: 'PROD-01', quantity: 42 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [req, init] = mockFetch.mock.calls[0];
    const url = req instanceof Request ? req.url : String(req);
    expect(url).toContain('/v1/inventory/stock/PROD-01');
    const headers = (init?.headers || (req instanceof Request ? req.headers : undefined)) as Headers;
    expect(headers.get('X-Tenant-Id')).toBe('tenant_sv_01');
    expect(headers.get('Authorization')).toBe('Bearer jwt_secret_token');
  });
});
