# Model a payment system with discriminated unions

> A design exercise disguised as a typing exercise. Tests whether you can make invalid states unrepresentable.

## Problem

Model the state of a payment in an e-commerce checkout. A payment can be:
- **Pending** — just initiated, no payment info yet
- **Processing** — payment method submitted, waiting for gateway
- **Succeeded** — completed, has a transaction ID and amount
- **Failed** — gateway rejected, has an error code and message
- **Refunded** — previously succeeded, now refunded (has original + refund transaction IDs)

Write the types and a `getStatusLabel` function that returns a human-readable string for each state. Use exhaustiveness checking.

## Solution

```ts
type PaymentState =
  | {
      status: 'pending';
      createdAt: Date;
    }
  | {
      status: 'processing';
      createdAt: Date;
      paymentMethodId: string;
    }
  | {
      status: 'succeeded';
      createdAt: Date;
      settledAt: Date;
      transactionId: string;
      amountCents: number;
      currency: string;
    }
  | {
      status: 'failed';
      createdAt: Date;
      failedAt: Date;
      errorCode: string;
      errorMessage: string;
    }
  | {
      status: 'refunded';
      createdAt: Date;
      settledAt: Date;
      refundedAt: Date;
      transactionId: string;
      refundTransactionId: string;
      amountCents: number;
      currency: string;
    };
```

```ts
function assertNever(x: never): never {
  throw new Error('Unhandled payment status: ' + JSON.stringify(x));
}

function getStatusLabel(payment: PaymentState): string {
  switch (payment.status) {
    case 'pending':
      return 'Waiting for payment details';

    case 'processing':
      return 'Processing payment…';

    case 'succeeded':
      return `Payment of ${(payment.amountCents / 100).toFixed(2)} ${payment.currency} confirmed`;

    case 'failed':
      return `Payment failed: ${payment.errorMessage} (${payment.errorCode})`;

    case 'refunded':
      return `Refunded ${(payment.amountCents / 100).toFixed(2)} ${payment.currency}`;

    default:
      return assertNever(payment);
  }
}
```

## Why each variant has its own shape

Inside `case 'succeeded'`, TypeScript knows:
- `payment.transactionId` exists (string)
- `payment.amountCents` exists (number)
- `payment.errorCode` does NOT exist — compile error if you try

Inside `case 'failed'`:
- `payment.errorCode` and `payment.errorMessage` exist
- `payment.transactionId` does NOT exist

This makes it impossible to accidentally access `payment.transactionId` in the failure branch.

## Extension — transitions

```ts
type PaymentTransition =
  | { from: 'pending';    to: 'processing'; paymentMethodId: string }
  | { from: 'processing'; to: 'succeeded';  transactionId: string; amountCents: number; currency: string }
  | { from: 'processing'; to: 'failed';     errorCode: string; errorMessage: string }
  | { from: 'succeeded';  to: 'refunded';   refundTransactionId: string };

function applyTransition(state: PaymentState, t: PaymentTransition): PaymentState {
  if (state.status !== t.from) throw new Error(`Invalid transition from ${state.status}`);

  switch (t.to) {
    case 'processing':
      return { ...state, status: 'processing', paymentMethodId: t.paymentMethodId };
    case 'succeeded':
      return { ...state, status: 'succeeded', settledAt: new Date(), transactionId: t.transactionId, amountCents: t.amountCents, currency: t.currency };
    case 'failed':
      return { ...state, status: 'failed', failedAt: new Date(), errorCode: t.errorCode, errorMessage: t.errorMessage };
    case 'refunded':
      if (state.status !== 'succeeded') throw new Error('Can only refund a succeeded payment');
      return { ...state, status: 'refunded', refundedAt: new Date(), refundTransactionId: t.refundTransactionId };
  }
}
```

## Senior follow-ups

- **"What's the alternative without discriminated unions?"** A flat object with optional fields and an enum/string `status`. The problem: TypeScript can't guarantee `transactionId` is present when `status === 'succeeded'`. You'd need runtime checks everywhere.
- **"How do you share common fields without repeating them?"** Extract them: `type BasePayment = { createdAt: Date }; type Succeeded = BasePayment & { status: 'succeeded'; ... }`. Or use intersection inside the union.
- **"How does this map to a database?"** Usually a single row with nullable columns. The discriminated union lives at the application layer — you validate/transform when reading from DB. Libraries like `zod` or `io-ts` can parse and type the raw DB row simultaneously.
