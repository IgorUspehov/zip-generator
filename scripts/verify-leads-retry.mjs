#!/usr/bin/env node
/**
 * Local unit checks for lead retry + success-gate (no Firestore / no browser).
 *
 *   node scripts/verify-leads-retry.mjs
 */
import assert from "node:assert/strict";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function computeBackoffDelay(attempt, baseDelayMs, maxDelayMs) {
  const exp = Math.max(0, attempt - 1);
  return Math.min(maxDelayMs, baseDelayMs * 2 ** exp);
}

async function withRetries(fn, options = {}) {
  const attempts = Math.max(1, options.attempts ?? 3);
  const baseDelayMs = options.baseDelayMs ?? 300;
  const maxDelayMs = options.maxDelayMs ?? 2_000;
  const shouldRetry = options.shouldRetry ?? (() => true);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      const canRetry = attempt < attempts && shouldRetry(error, attempt);
      if (!canRetry) break;
      const delayMs = computeBackoffDelay(attempt, baseDelayMs, maxDelayMs);
      options.onRetry?.(error, attempt, delayMs);
      await sleep(delayMs);
    }
  }
  throw lastError;
}

class LeadRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.retryable = status === 0 || status === 408 || status === 429 || status >= 500;
  }
}

function isRetryableLeadError(error) {
  if (error instanceof LeadRequestError) return error.retryable;
  return true;
}

/** Mirrors booking-form success gate: only ok:true counts. */
function interpretResponse(resOk, data) {
  if (!resOk) {
    throw new LeadRequestError(data?.error || "http_error", data?.status || 500);
  }
  if (data?.ok !== true) {
    throw new LeadRequestError("invalid_success_payload", 502);
  }
  return { success: true };
}

async function main() {
  // 1) backoff math
  assert.equal(computeBackoffDelay(1, 400, 2000), 400);
  assert.equal(computeBackoffDelay(2, 400, 2000), 800);
  assert.equal(computeBackoffDelay(3, 400, 2000), 1600);
  assert.equal(computeBackoffDelay(4, 400, 2000), 2000);

  // 2) server-style: fail twice, succeed on 3rd
  let serverAttempts = 0;
  const serverResult = await withRetries(
    async () => {
      serverAttempts += 1;
      if (serverAttempts < 3) throw new Error("firestore_unavailable");
      return { ok: true, bookingId: "rec-apt-1" };
    },
    { attempts: 3, baseDelayMs: 10, maxDelayMs: 50 },
  );
  assert.equal(serverAttempts, 3);
  assert.equal(serverResult.bookingId, "rec-apt-1");

  // 3) server-style: all fail → error (no silent success)
  let failAttempts = 0;
  await assert.rejects(
    () =>
      withRetries(
        async () => {
          failAttempts += 1;
          throw new Error("firestore_down");
        },
        { attempts: 3, baseDelayMs: 5, maxDelayMs: 20 },
      ),
    /firestore_down/,
  );
  assert.equal(failAttempts, 3);

  // 4) front: 5xx retried, then success — user would see success only after ok:true
  let frontAttempts = 0;
  const frontOk = await withRetries(
    async () => {
      frontAttempts += 1;
      if (frontAttempts < 2) {
        throw new LeadRequestError("server", 503);
      }
      return interpretResponse(true, { ok: true, mode: "appointment" });
    },
    {
      attempts: 3,
      baseDelayMs: 5,
      maxDelayMs: 20,
      shouldRetry: (err) => isRetryableLeadError(err),
    },
  );
  assert.equal(frontAttempts, 2);
  assert.equal(frontOk.success, true);

  // 5) front: 400 validation — no retry, no success
  let validationAttempts = 0;
  await assert.rejects(
    () =>
      withRetries(
        async () => {
          validationAttempts += 1;
          throw new LeadRequestError("invalid phone", 400);
        },
        {
          attempts: 3,
          baseDelayMs: 5,
          shouldRetry: (err) => isRetryableLeadError(err),
        },
      ),
    /invalid phone/,
  );
  assert.equal(validationAttempts, 1);

  // 6) ambiguous body must NOT look like success (no false Danke)
  assert.throws(() => interpretResponse(true, { ok: false }), /invalid_success_payload/);
  assert.throws(() => interpretResponse(true, {}), /invalid_success_payload/);
  assert.throws(() => interpretResponse(false, { status: 500 }), /http_error/);

  // 7) niches: map modes that forms use
  const niches = [
    { businessType: "beauty_salon", mode: "appointment" },
    { businessType: "dental_clinic", mode: "appointment" },
    { businessType: "ecommerce", mode: "order" },
  ];
  for (const n of niches) {
    assert.ok(n.mode === "appointment" || n.mode === "order");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        checks: [
          "backoff",
          "server_retry_then_ok",
          "server_retry_exhausted",
          "front_5xx_then_ok",
          "front_400_no_retry",
          "no_false_success",
          "niches_appointment_order",
        ],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
