export { GrandfleetClient, type GrandfleetClientOptions } from './client.js';
export { FixedMoney } from './utils/money.js';
export { ProblemDetailsError, type ProblemDetails } from './utils/errors.js';

export { AuthModule } from './modules/auth.js';
export { PosModule, type CartItem, type PaymentItem } from './modules/pos.js';
export { InventoryModule } from './modules/inventory.js';
export { LedgerModule, type LedgerLine } from './modules/ledger.js';

export type { paths, components } from './generated/schema.js';
