import { describe, it, expect } from 'vitest';
import { ProblemDetailsError } from '../src/utils/errors.js';

describe('ProblemDetailsError', () => {
  it('formats RFC 7807 problem details properly', () => {
    const err = new ProblemDetailsError({
      status: 402,
      title: 'Quota Exhausted',
      detail: 'Tenant tenant_123 has exceeded monthly API quota limit',
      code: 'QUOTA_EXCEEDED',
    });

    expect(err.name).toBe('ProblemDetailsError');
    expect(err.status).toBe(402);
    expect(err.code).toBe('QUOTA_EXCEEDED');
    expect(err.message).toBe('[402] Quota Exhausted: Tenant tenant_123 has exceeded monthly API quota limit');
  });
});
