import { convertIntegrationFnToClass } from '@sentry/core';
import type { Event, Integration, IntegrationClass, IntegrationFn } from '@sentry/types';

import { WINDOW } from '../helpers';

const INTEGRATION_NAME = 'HttpContext';

const httpContextIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    // TODO v8: Remove this
    setupOnce() {}, // eslint-disable-line @typescript-eslint/no-empty-function
    preprocessEvent(event) {
      // if none of the information we want exists, don't bother
      if (!WINDOW.navigator && !WINDOW.location && !WINDOW.document) {
        return;
      }

      // grab as much info as exists and add it to the event
      const url = (event.request && event.request.url) || (WINDOW.location && WINDOW.location.href);
      const { referrer } = WINDOW.document || {};
      const { userAgent } = WINDOW.navigator || {};

      const headers = {
        ...(event.request && event.request.headers),
        ...(referrer && { Referer: referrer }),
        ...(userAgent && { 'User-Agent': userAgent }),
      };
      const request = { ...event.request, ...(url && { url }), headers };

      event.request = request;
    },
  };
}) satisfies IntegrationFn;

/** HttpContext integration collects information about HTTP request headers */
// eslint-disable-next-line deprecation/deprecation
export const HttpContext = convertIntegrationFnToClass(INTEGRATION_NAME, httpContextIntegration) as IntegrationClass<
  Integration & { preprocessEvent: (event: Event) => void }
>;
