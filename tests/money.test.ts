import { describe, it, expect } from 'vitest';
import { FixedMoney } from '../src/utils/money.js';

describe('FixedMoney', () => {
  it('converts decimal strings to 10^-4 integer units correctly', () => {
    const m = FixedMoney.fromDecimalString('10.50');
    expect(m.amountInUnits).toBe(105000);
    expect(m.toDecimalString()).toBe('10.5000');
    expect(m.toNumber()).toBe(10.5);
  });

  it('handles addition and subtraction without floating point errors', () => {
    const a = FixedMoney.fromDecimalString('0.10'); // 1000 units
    const b = FixedMoney.fromDecimalString('0.20'); // 2000 units
    const sum = a.add(b);
    expect(sum.amountInUnits).toBe(3000);
    expect(sum.toDecimalString()).toBe('0.3000');

    const diff = b.subtract(a);
    expect(diff.amountInUnits).toBe(1000);
    expect(diff.toDecimalString()).toBe('0.1000');
  });

  it('multiplies correctly with rounding', () => {
    const price = FixedMoney.fromDecimalString('19.99'); // 199900 units
    const total = price.multiply(3); // 599700 units
    expect(total.amountInUnits).toBe(599700);
    expect(total.toDecimalString()).toBe('59.9700');
  });
});
