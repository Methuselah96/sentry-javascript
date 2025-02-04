import { expect } from '@playwright/test';
import type { Event } from '@sentry/types';

import { sentryTest } from '../../../../utils/fixtures';
import { getFirstSentryEnvelopeRequest } from '../../../../utils/helpers';

sentryTest('should capture a parameterized representation of the message', async ({ getLocalTestPath, page }) => {
  const bundle = process.env.PW_BUNDLE;

  if (bundle && bundle.startsWith('bundle_')) {
    sentryTest.skip();
  }

  const url = await getLocalTestPath({ testDir: __dirname });

  const eventData = await getFirstSentryEnvelopeRequest<Event>(page, url);

  expect(eventData.logentry).toStrictEqual({
    message: 'This is a log statement with %s and %s params',
    params: ['first', 'second'],
  });
});
