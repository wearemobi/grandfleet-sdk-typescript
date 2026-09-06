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
});
