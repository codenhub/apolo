# Feedback

**Status:** DRAFT
**Last updated:** 2026-05-29

Feedback is the UI-facing boundary for operation outcomes.

Callers should do their work, receive the app `Result` contract, then register that result with `feedback`. The feedback module handles user-facing and diagnostic side effects such as toasts, error logging, and events. Callers stay focused on workflow decisions.

## Contract

Feedback consumes the core `Result<T>` contract:

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };
```

Success means the caller can continue its normal flow.

Failure means feedback handled the error side effects, and the caller should stop normal flow or run an alternate path. Retry decisions should use `result.error.retryable`.

Raw or unknown errors should already be converted to `AppError` by the core `Result` helpers before they reach feedback. Feedback handles the UI side effects for the result; it does not add another raw-error API.

## Registering Results

```ts
const result = feedback.register(saveResult, {
  success: {
    key: "feedback.fileSaved",
    fallback: "File saved successfully.",
  },
  fallback: "Could not save file.",
  toast: true,
});

if (!result.ok) return;

continueFlow(result.value);
```

`register()` returns the same `Result` shape it receives.

This keeps caller code simple while centralizing feedback behavior.

## Options

```ts
interface FeedbackMessage {
  key: string;
  fallback?: string;
}

interface RegisterFeedbackOptions {
  success?: FeedbackMessage;
  fallback?: string;
  toast?: boolean;
  log?: boolean;
  toastPosition?: ToastOptions["position"];
}
```

Feedback decides when to show a toast, log errors, or dispatch events. `RegisterFeedbackOptions` overrides those defaults for a specific registration.

`success` is optional. If omitted, successful operations dispatch events, but do not show success feedback by default. When provided, feedback translates `success.key`; if no translation exists, it uses `success.fallback`.

`fallback` is the display fallback for unknown errors when the received `AppError` has no better user-facing message. When an `AppError` has `messageKey`, feedback translates that key and falls back to `error.message`. Known error messages are not overridden, and the original result is not mutated.

`toast` controls user-facing toast rendering for this registration. When omitted, feedback uses defaults. `true` forces toast rendering when there is a message to show. `false` suppresses toast rendering.

`log` controls `AppError` logging for this registration.

`toastPosition` controls toast placement.

## Default Behavior

On success:

- dispatch `success` event
- show success toast only when `success` is provided

On error:

- use `result.error` as the `AppError`
- log the `AppError` to console
- show error toast
- dispatch `error` event

## Events

Feedback exposes typed subscriptions.

```ts
const unsubscribe = feedback.subscribe("error", ({ error }) => {
  if (error.retryable) {
    showRetryAction();
  }
});

unsubscribe();
```

Supported events:

```ts
interface FeedbackEntry {
  type: "success" | "error";
  message: string | null;
}

interface FeedbackEventMap {
  success: {
    entry: FeedbackEntry;
    value: unknown;
  };
  error: {
    entry: FeedbackEntry;
    error: AppError;
  };
}
```

Event names should come from the feedback module type surface, not caller-defined constants.

Listener failures are isolated: one failing listener must not stop other listeners or make `register()` throw.

## Public API

```ts
feedback.register(result, options);
feedback.subscribe(eventName, listener);
```

`subscribe()` returns an unsubscribe function. Call it when the listener is no longer needed.

## Design Rules

Feedback owns side effects.

Callers own workflow.

Errors own retry semantics through `AppError.retryable`.
