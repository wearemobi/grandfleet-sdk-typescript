/**
 * FixedMoney provides precise 4-decimal fixed-scale integer math ($10^-4$)
 * to eliminate IEEE 754 floating point rounding errors in financial transactions.
 *
 * Example: $10.50 is represented internally as 105000 (105000 / 10000 = 10.50).
 */
export class FixedMoney {
  private static readonly SCALE = 10000;

  private constructor(public readonly amountInUnits: number) {
    if (!Number.isInteger(amountInUnits)) {
      throw new Error(`FixedMoney amount must be an integer: ${amountInUnits}`);
    }
  }

  /**
   * Creates a FixedMoney instance from fixed 4-decimal integer units ($10^-4$).
   */
  public static fromUnits(units: number): FixedMoney {
    return new FixedMoney(Math.round(units));
  }

  /**
   * Creates a FixedMoney instance from a decimal string (e.g., "10.50" -> 105000 units).
   */
  public static fromDecimalString(decimalStr: string): FixedMoney {
    const parsed = parseFloat(decimalStr);
    if (isNaN(parsed)) {
      throw new Error(`Invalid decimal string for FixedMoney: "${decimalStr}"`);
    }
    return new FixedMoney(Math.round(parsed * FixedMoney.SCALE));
  }

  /**
   * Converts units back to a formatted decimal string (e.g., 105000 -> "10.5000").
   */
  public toDecimalString(decimals = 4): string {
    return (this.amountInUnits / FixedMoney.SCALE).toFixed(decimals);
  }

  /**
   * Converts units back to a standard JavaScript number (use only for display purposes).
   */
  public toNumber(): number {
    return this.amountInUnits / FixedMoney.SCALE;
  }

  public add(other: FixedMoney): FixedMoney {
    return new FixedMoney(this.amountInUnits + other.amountInUnits);
  }

  public subtract(other: FixedMoney): FixedMoney {
    return new FixedMoney(this.amountInUnits - other.amountInUnits);
  }

  public multiply(factor: number): FixedMoney {
    return new FixedMoney(Math.round(this.amountInUnits * factor));
  }
}
