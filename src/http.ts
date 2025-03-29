import { ok, ResultAsync } from 'neverthrow';

import { sleep } from './datetime.js';
import { ExceptionBuilder, RuntimeException } from './exception.js';
import { asyncResultify } from './result.js';

import type { ExceptionLike } from './exception.js';

type NetworkErrorOptions = {
  cause: unknown;
  details: {
    kind: 'NETWORK_ERROR';
    url: string;
  };
};

type HttpErrorOptions = {
  details: {
    kind: 'HTTP_ERROR';
    status: number;
    statusText: string;
    url: string;
  };
};

export const { FetchException } = new ExceptionBuilder()
  .setOptionsType<HttpErrorOptions | NetworkErrorOptions>()
  .setParams({
    message: (details) => `HTTP request to '${details.url}' failed`,
    name: 'FetchException'
  })
  .build();

export function safeFetch(url: string, init: RequestInit): ResultAsync<Response, typeof FetchException.Instance> {
  return asyncResultify(async () => {
    try {
      const response = await fetch(url, init);
      if (response.ok) {
        return ok(response);
      }
      return FetchException.asErr({
        details: {
          kind: 'HTTP_ERROR',
          status: response.status,
          statusText: response.statusText,
          url
        }
      });
    } catch (err) {
      return FetchException.asErr({
        cause: err,
        details: {
          kind: 'NETWORK_ERROR',
          url
        }
      });
    }
  });
}

export function waitForServer(
  url: string,
  { interval = 1, timeout = 10 }: { interval?: number; timeout?: number } = {}
): ResultAsync<void, ExceptionLike> {
  return asyncResultify(async () => {
    let secondsElapsed = 0;
    while (secondsElapsed < timeout) {
      const fetchResult = await safeFetch(url, { method: 'GET' });
      if (fetchResult.isOk()) {
        return ok();
      }
      const { error } = fetchResult;
      if (error.details.kind === 'HTTP_ERROR') {
        return RuntimeException.asErr(`Request to '${url}' returned status code ${error.details.status}`, {
          cause: fetchResult.error
        });
      }
      await sleep(interval);
      secondsElapsed += interval;
    }
    return RuntimeException.asErr(`Failed to connect to '${url}' after timeout of ${timeout}s`);
  });
}
