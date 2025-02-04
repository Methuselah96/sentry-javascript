import { Hub, captureCheckIn, makeMain, setCurrentClient } from '@sentry/core';
import type { Client, Integration } from '@sentry/types';

import { installedIntegrations } from '../../src/integration';
import { initAndBind } from '../../src/sdk';
import { TestClient, getDefaultTestClientOptions } from '../mocks/client';

// eslint-disable-next-line no-var
declare var global: any;

const PUBLIC_DSN = 'https://username@domain/123';

export class MockIntegration implements Integration {
  public name: string;
  public setupOnce: () => void = jest.fn();
  public constructor(name: string) {
    this.name = name;
  }
}

describe('SDK', () => {
  beforeEach(() => {
    global.__SENTRY__ = {};
    installedIntegrations.splice(0);
  });

  describe('initAndBind', () => {
    test('installs integrations provided through options', () => {
      const integrations: Integration[] = [
        new MockIntegration('MockIntegration 1'),
        new MockIntegration('MockIntegration 2'),
      ];
      const options = getDefaultTestClientOptions({ dsn: PUBLIC_DSN, integrations });
      initAndBind(TestClient, options);
      expect((integrations[0].setupOnce as jest.Mock).mock.calls.length).toBe(1);
      expect((integrations[1].setupOnce as jest.Mock).mock.calls.length).toBe(1);
    });
  });
});

describe('captureCheckIn', () => {
  afterEach(function () {
    const hub = new Hub();
    // eslint-disable-next-line deprecation/deprecation
    makeMain(hub);
  });

  it('returns an id when client is defined', () => {
    const client = {
      captureCheckIn: () => 'some-id-wasd-1234',
    } as unknown as Client;
    setCurrentClient(client);

    expect(captureCheckIn({ monitorSlug: 'gogogo', status: 'in_progress' })).toStrictEqual('some-id-wasd-1234');
  });

  it('returns an id when client is undefined', () => {
    expect(captureCheckIn({ monitorSlug: 'gogogo', status: 'in_progress' })).toStrictEqual(expect.any(String));
  });
});
