import type { Client } from './client';
import type { Event, EventHint } from './event';
import type { EventProcessor } from './eventprocessor';
import type { Hub } from './hub';

/** Integration Class Interface */
export interface IntegrationClass<T> {
  /**
   * Property that holds the integration name
   */
  id: string;

  new (...args: any[]): T;
}

/** Integration interface.
 * This is more or less the same as `Integration`, but with a slimmer `setupOnce` siganture. */
export interface IntegrationFnResult {
  /**
   * The name of the integration.
   */
  name: string;

  /**
   * This hook is only called once, even if multiple clients are created.
   * It does not receives any arguments, and should only use for e.g. global monkey patching and similar things.
   *
   * NOTE: In v8, this will become optional.
   */
  setupOnce(): void;

  /**
   * Set up an integration for the given client.
   * Receives the client as argument.
   *
   * Whenever possible, prefer this over `setupOnce`, as that is only run for the first client,
   * whereas `setup` runs for each client. Only truly global things (e.g. registering global handlers)
   * should be done in `setupOnce`.
   */
  setup?(client: Client): void;

  /**
   * An optional hook that allows to preprocess an event _before_ it is passed to all other event processors.
   */
  preprocessEvent?(event: Event, hint: EventHint | undefined, client: Client): void;

  /**
   * An optional hook that allows to process an event.
   * Return `null` to drop the event, or mutate the event & return it.
   * This receives the client that the integration was installed for as third argument.
   */
  processEvent?(event: Event, hint: EventHint, client: Client): Event | null | PromiseLike<Event | null>;
}

/**
 * An integration in function form.
 * This is expected to return an integration.
 */
export type IntegrationFn = (...rest: any[]) => IntegrationFnResult;

/** Integration interface */
export interface Integration {
  /**
   * The name of the integration.
   */
  name: string;

  /**
   * This hook is only called once, even if multiple clients are created.
   * It does not receives any arguments, and should only use for e.g. global monkey patching and similar things.
   *
   * NOTE: In v8, this will become optional, and not receive any arguments anymore.
   */
  setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;

  /**
   * Set up an integration for the given client.
   * Receives the client as argument.
   *
   * Whenever possible, prefer this over `setupOnce`, as that is only run for the first client,
   * whereas `setup` runs for each client. Only truly global things (e.g. registering global handlers)
   * should be done in `setupOnce`.
   */
  setup?(client: Client): void;

  /**
   * An optional hook that allows to preprocess an event _before_ it is passed to all other event processors.
   */
  preprocessEvent?(event: Event, hint: EventHint | undefined, client: Client): void;

  /**
   * An optional hook that allows to process an event.
   * Return `null` to drop the event, or mutate the event & return it.
   * This receives the client that the integration was installed for as third argument.
   */
  processEvent?(event: Event, hint: EventHint, client: Client): Event | null | PromiseLike<Event | null>;
}
