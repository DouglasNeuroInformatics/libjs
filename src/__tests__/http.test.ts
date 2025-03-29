import type { Err } from 'neverthrow';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as datetime from '../datetime.js';
import { safeFetch, waitForServer } from '../http.js';

const fetch = vi.hoisted(() => vi.fn());
const networkError = new Error('Network Error');

vi.stubGlobal('fetch', fetch);

afterEach(() => {
  vi.resetAllMocks();
});

describe('safeFetch', () => {
  it('should return an Ok result when the request succeeds', async () => {
    const mockResponse = { ok: true, status: 200, statusText: 'OK' };
    fetch.mockResolvedValueOnce(mockResponse);
    const result = await safeFetch('http://localhost:6789', { method: 'GET' });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(mockResponse);
    }
  });

  it('should return an Err result with HTTP_ERROR when the response is not ok', async () => {
    const mockResponse = { ok: false, status: 404, statusText: 'Not Found' };
    fetch.mockResolvedValueOnce(mockResponse);
    const result = await safeFetch('http://localhost:6789', { method: 'GET' });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toMatchObject({
        details: {
          kind: 'HTTP_ERROR',
          status: 404,
          statusText: 'Not Found',
          url: 'http://localhost:6789'
        },
        name: 'FetchException'
      });
    }
  });

  it('should return an Err result with NETWORK_ERROR when fetch throws', async () => {
    fetch.mockRejectedValueOnce(networkError);
    const result = await safeFetch('http://localhost:6789', { method: 'GET' });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toMatchObject({
        cause: networkError,
        details: {
          kind: 'NETWORK_ERROR',
          url: 'http://localhost:6789'
        },
        name: 'FetchException'
      });
    }
  });

  it('should pass through the RequestInit options to fetch', async () => {
    const mockResponse = { ok: true, status: 200, statusText: 'OK' };
    fetch.mockResolvedValueOnce(mockResponse);
    const init = {
      body: JSON.stringify({ test: 'data' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    };
    await safeFetch('http://localhost:6789', init);
    expect(fetch).toHaveBeenCalledWith('http://localhost:6789', init);
  });
});

describe('waitForServer', () => {
  it('should return an Ok result when server becomes available', async () => {
    fetch.mockRejectedValueOnce(networkError);
    fetch.mockRejectedValueOnce(networkError);
    fetch.mockResolvedValueOnce({ ok: true });
    const time = Date.now();
    const result = await waitForServer('http://localhost:6789', { interval: 0.1, timeout: 0.3 });
    expect(result.isOk()).toBe(true);
    expect(Date.now() - time).toBeGreaterThanOrEqual(200);
    expect(Date.now() - time).toBeLessThan(300);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('should return an Err result after the timeout if the server never becomes available', async () => {
    fetch.mockRejectedValue(networkError);
    const result = (await waitForServer('http://localhost:6789', { interval: 0.1, timeout: 0.3 })) as Err<void, Error>;
    expect(result.error.message).toBe("Failed to connect to 'http://localhost:6789' after timeout of 0.3s");
  });

  it('should use a default timeout of 10 seconds and interval of 1 second', async () => {
    fetch.mockRejectedValue(networkError);
    vi.spyOn(datetime, 'sleep').mockResolvedValue();
    const result = (await waitForServer('http://localhost:6789')) as Err<void, Error>;
    expect(result.error.message).toBe("Failed to connect to 'http://localhost:6789' after timeout of 10s");
    expect(fetch).toHaveBeenCalledTimes(10);
  });

  it('should return an Err result if the HTTP request succeeds, but is not a 200-level response', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const result = (await waitForServer('http://localhost:6789', { interval: 0.1, timeout: 0.3 })) as Err<void, Error>;
    expect(result.error.message).toBe("Request to 'http://localhost:6789' returned status code 500");
  });
});
