import { applySdkMetadata } from '@sentry/core';
import type { NodeOptions } from '@sentry/node';
import { getClient } from '@sentry/node';
import { getCurrentScope, init as nodeInit } from '@sentry/node';
import { logger } from '@sentry/utils';

import { DEBUG_BUILD } from './utils/debug-build';
import { instrumentServer } from './utils/instrumentServer';
import type { RemixOptions } from './utils/remixOptions';

// We need to explicitly export @sentry/node as they end up under `default` in ESM builds
// See: https://github.com/getsentry/sentry-javascript/issues/8474
export {
  // eslint-disable-next-line deprecation/deprecation
  addGlobalEventProcessor,
  addEventProcessor,
  addBreadcrumb,
  captureCheckIn,
  withMonitor,
  captureException,
  captureEvent,
  captureMessage,
  // eslint-disable-next-line deprecation/deprecation
  configureScope,
  createTransport,
  // eslint-disable-next-line deprecation/deprecation
  extractTraceparentData,
  // eslint-disable-next-line deprecation/deprecation
  getActiveTransaction,
  getHubFromCarrier,
  // eslint-disable-next-line deprecation/deprecation
  getCurrentHub,
  Hub,
  // eslint-disable-next-line deprecation/deprecation
  makeMain,
  setCurrentClient,
  Scope,
  // eslint-disable-next-line deprecation/deprecation
  startTransaction,
  SDK_VERSION,
  setContext,
  setExtra,
  setExtras,
  setTag,
  setTags,
  setUser,
  spanStatusfromHttpCode,
  // eslint-disable-next-line deprecation/deprecation
  trace,
  withScope,
  withIsolationScope,
  autoDiscoverNodePerformanceMonitoringIntegrations,
  makeNodeTransport,
  // eslint-disable-next-line deprecation/deprecation
  defaultIntegrations,
  getDefaultIntegrations,
  defaultStackParser,
  // eslint-disable-next-line deprecation/deprecation
  lastEventId,
  flush,
  close,
  getSentryRelease,
  addRequestDataToEvent,
  DEFAULT_USER_INCLUDES,
  extractRequestData,
  // eslint-disable-next-line deprecation/deprecation
  deepReadDirSync,
  Integrations,
  Handlers,
  cron,
} from '@sentry/node';

// Keeping the `*` exports for backwards compatibility and types
export * from '@sentry/node';

export { captureRemixServerException, wrapRemixHandleError } from './utils/instrumentServer';
export { ErrorBoundary, withErrorBoundary } from '@sentry/react';
export { remixRouterInstrumentation, withSentry } from './client/performance';
export { captureRemixErrorBoundaryError } from './client/errors';
export { wrapExpressCreateRequestHandler } from './utils/serverAdapters/express';

export type { SentryMetaArgs } from './utils/types';

function sdkAlreadyInitialized(): boolean {
  return !!getClient();
}

/** Initializes Sentry Remix SDK on Node. */
export function init(options: RemixOptions): void {
  applySdkMetadata(options, 'remix', ['remix', 'node']);

  if (sdkAlreadyInitialized()) {
    DEBUG_BUILD && logger.log('SDK already initialized');

    return;
  }

  instrumentServer();

  nodeInit(options as NodeOptions);

  getCurrentScope().setTag('runtime', 'node');
}
