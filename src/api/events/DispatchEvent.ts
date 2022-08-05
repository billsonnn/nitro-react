import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';

export const DispatchEvent = (eventDispatcher: IEventDispatcher, event: NitroEvent) => eventDispatcher.dispatchEvent(event);
