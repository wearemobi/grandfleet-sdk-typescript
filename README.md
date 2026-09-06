# `@wearemobi/grandfleet`

> Official TypeScript SDK for **Grandfleet by M.O.B.I.™** – Contract-Driven Sovereign Cloud & POS Infrastructure.

[![CI](https://github.com/wearemobi/grandfleet-sdk-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/wearemobi/grandfleet-sdk-typescript/actions)
[![npm version](https://img.shields.io/npm/v/@wearemobi/grandfleet.svg)](https://www.npmjs.com/package/@wearemobi/grandfleet)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

---

## ⚡ Overview

The `@wearemobi/grandfleet` package provides type-safe TypeScript client libraries and utilities for interacting with **Grandfleet** sovereign cloud services, POS systems, inventory management, and double-entry accounting ledgers.

- **Contract-Driven**: Auto-generated types directly from Grandfleet's canonical OpenAPI 3.1 specification.
- **Fixed-Scale Money**: Built-in `FixedMoney` helper ($10^{-4}$ integer precision) eliminating floating point rounding errors in financial transactions.
- **RFC 7807 Problem Details**: Native error handling with `ProblemDetailsError`.
- **Multi-Tenant & Security**: Built-in header propagation (`X-Tenant-Id`, `Authorization: Bearer`, `X-Trace-Id`).
- **Ergonomic Facades**: Built-in domain facades (`client.auth`, `client.pos`, `client.inventory`, `client.ledger`).
- **Dual Bundle**: Modern ESM (`dist/index.js`) + CJS (`dist/index.cjs`) support.

---

## 📦 Installation

```bash
# Standard Fleet Manager (pnpm)
pnpm add @wearemobi/grandfleet

# Using npm
npm install @wearemobi/grandfleet

# Using yarn
yarn add @wearemobi/grandfleet
```

---

## 🚀 Quickstart

```typescript
import { GrandfleetClient, FixedMoney } from '@wearemobi/grandfleet';

// 1. Initialize Grandfleet client
const client = new GrandfleetClient({
  baseUrl: 'https://api.wearemobi.com',
  tenantId: 'tenant_cr_san_jose',
});

// 2. Authenticate operator via auth facade
const loginResult = await client.auth.login('tenant_cr_san_jose', 'caja', '1234');
console.log('Logged in successfully, token stored in client:', loginResult?.token);

// 3. POS Cart Calculation using Fixed-Scale Money ($10^-4) via pos facade
const cartResult = await client.pos.calculateCart([
  {
    sku: 'PROD-COFFEE-001',
    quantity: 2,
    unit_price_units: FixedMoney.fromDecimalString('3.50').amountInUnits, // 35000 units ($3.5000)
  },
]);

console.log('Cart subtotal:', FixedMoney.fromUnits(cartResult.subtotal_units).toDecimalString());
```

---

## 🛠️ Key Utilities

### `FixedMoney` Precision Math
Grandfleet uses 4-decimal fixed-scale integers ($10^{-4}$) to guarantee 100% precision without IEEE 754 float drift:

```typescript
import { FixedMoney } from '@wearemobi/grandfleet';

const price = FixedMoney.fromDecimalString('19.99'); // 199900 integer units
const tax = price.multiply(0.13); // 13% tax = 25987 integer units

console.log(tax.toDecimalString()); // "2.5987"
console.log(tax.toNumber()); // 2.5987
```

### RFC 7807 Error Handling
```typescript
import { ProblemDetailsError } from '@wearemobi/grandfleet';

try {
  await pos.checkout('idempotency_123', 'cart_456', 'CARD', 10000);
} catch (error) {
  if (error instanceof ProblemDetailsError) {
    console.error(`API Error [${error.status}]: ${error.problem.title}`);
    console.error(`Details: ${error.problem.detail}`);
    console.error(`Error Code: ${error.code}`);
  }
}
```

---

## 🏛️ Architecture & Governance

This SDK repository is maintained by **M.O.B.I.™ Labs** in accordance with M.O.B.I.™ SDD Manifesto v1.1.1 and Git Convention v1.6.0.

- Canonical OpenAPI Specification: `grandfleet` (`docs/api/openapi.yaml`).
- Architecture ADR: `docs/adr/ADR-0014-ware-vertical-ecosystem-archaeology-and-satellite-fleet-roadmap.md`.

---

## 📄 License

Licensed under the [Apache-2.0 License](LICENSE). Copyright © 2026 M.O.B.I.™ (WeAreMobi).
