/**
 * Hadislam enforces ~7 requests/minute. Serialize + space calls and retry 429s
 * so browsing past ~140 hadiths (page 7 × 20) does not hard-fail.
 */

type QueueJob<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

/** ~7 req/min — keep a small buffer; larger page sizes mean fewer calls overall. */
const MIN_GAP_MS = 8800;
const MAX_RETRIES = 3;

let lastStartedAt = 0;
let chain: Promise<void> = Promise.resolve();

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const isRateLimitError = (error: unknown): boolean => {
  const status = (error as {response?: {status?: number}})?.response?.status;
  if (status === 429) {
    return true;
  }
  const message = String(
    (error as {response?: {data?: {error?: string}; message?: string}})?.response?.data
      ?.error ??
      (error as {message?: string})?.message ??
      '',
  );
  return /rate limit/i.test(message);
};

const retryAfterMs = (error: unknown): number => {
  const header = (error as {response?: {headers?: Record<string, string>}})?.response
    ?.headers?.['retry-after'];
  const seconds = header ? Number(header) : NaN;
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(60_000, seconds * 1000);
  }
  return 15_000;
};

/**
 * Run an Hadislam request behind a global throttle + 429 backoff.
 */
export const enqueueHadithRequest = <T>(run: () => Promise<T>): Promise<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const job: QueueJob<T> = {run, resolve, reject};

  chain = chain.then(async () => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastStartedAt));
    if (wait > 0) {
      await sleep(wait);
    }
    lastStartedAt = Date.now();

    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        job.resolve(await job.run());
        return;
      } catch (error) {
        if (!isRateLimitError(error) || attempt === MAX_RETRIES) {
          job.reject(error);
          return;
        }
        attempt += 1;
        await sleep(retryAfterMs(error));
        lastStartedAt = Date.now();
      }
    }
  });

  return promise;
};

export const isHadithRateLimitError = isRateLimitError;
