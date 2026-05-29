# Errors

**Status:** DRAFT
**Last updated:** 2026-05-29

This document covers how errors are handled in this app.

## Overview

Our goal is to avoid at all costs showing users raw error messages, always trying to identify and translate the issue that happened to a friendly and understandable message.

This scope only covers actual errors, issues, problems or anything that wasn't NORMAL or NATURAL behavior. Informational, success or any kind of message/behavior that doesn't interrupt a normal flow is out of scope and should be handled separately.

## The error shape

All errors in the app are normalized into `AppError`, defined in `src/shared/helpers/error` and available through the `@helpers/error` path alias.

```ts
class AppError extends Error {
  type: "known" | "unexpected" | "unknown";
  message: string; // safe fallback display message
  messageKey: string | null; // i18n key for known/unexpected errors
  source: "browser" | "internal" | "supabase" | null; // null when source cannot be determined
  originalError: unknown; // the raw thrown value, for logging
  retryable: boolean; // whether attempting the operation again makes sense
}
```

`type` reflects how confident the classifier was:

- `known` — matched a specific code, name, or message we explicitly recognize.
- `unexpected` — matched a heuristic pattern (e.g. any network failure). Message is still safe to show, but the exact cause is not known.
- `unknown` — no match at all. A generic fallback message is shown.

`message` is always safe to show, but it is a fallback string, not necessarily the final localized UI text. Known and unexpected errors also carry `messageKey`; UI-facing code should translate that key first and fall back to `message` when translation is unavailable. Unknown errors have `messageKey: null` and use `message` directly.

`retryable` is `true` only for patterns that are transient by nature: network failures and timeouts. Auth errors, validation errors, and anything `unknown` are `false`.

## Creating an AppError

Pass any thrown value — structured or not — to the constructor:

```ts
new AppError(error);
new AppError(error, { fallbackMessage: "Não foi possível salvar." });
```

The classifier unwraps nested errors up to three levels deep (via `cause`, `originalError`, and `error` fields) looking for a match, preferring the outermost candidate. If the input is already an `AppError`, it passes through unchanged — wrapping twice is safe. The `fallbackMessage` option only applies when the error ends up `unknown`; it does not override a successful classification or translated message key.

## Classification

`errors.ts` holds all the lookup tables. The classifier tries them in this order, stopping at the first match:

1. **`KNOWN_ERROR_FEEDBACK_BY_CODE`** — exact match on `error.code`. Used for Supabase error codes, for example (`invalid_credentials`, `otp_expired`, etc.).
2. **`KNOWN_ERROR_FEEDBACK_BY_NAME`** — exact match on `error.name`. Used for browser DOMException names, for example (`QuotaExceededError`, `SecurityError`).
3. **`KNOWN_ERROR_FEEDBACK_BY_MESSAGE`** — exact match on `error.message` after trimming trailing punctuation. Used when a specific message string is stable and known.
4. **`KNOWN_ERROR_PREFIX_DEFINITIONS`** — prefix match on `error.message`. Used when the message starts with a consistent prefix but varies after it (e.g. `"Upload failed: ..."`).
5. **`UNEXPECTED_ERROR_DEFINITIONS`** — regex match on `error.message`. Used for broad failure categories where the exact message is unpredictable.

### Adding a new known error

Pick the most specific lookup that fits:

- Returns a `code` field → `KNOWN_ERROR_FEEDBACK_BY_CODE`.
- Returns a standard `name` → `KNOWN_ERROR_FEEDBACK_BY_NAME`.
- Message is exact and stable → `KNOWN_ERROR_FEEDBACK_BY_MESSAGE`.
- Message has a consistent prefix but varies after it → `KNOWN_ERROR_PREFIX_DEFINITIONS`.
- Generic failure category (all network errors, all timeouts) → `UNEXPECTED_ERROR_DEFINITIONS`.

Mark `retryable: true` only if retrying the same operation could reasonably succeed (transient failures). Do not mark auth, validation, or resource-not-found errors as retryable.

Every known or unexpected error entry must include both a fallback `feedback` string and a `feedbackKey`. The fallback keeps errors readable before i18n is ready, when locale loading fails, or when the UI boundary does not use i18n.
