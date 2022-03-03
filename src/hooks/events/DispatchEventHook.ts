import { IEventDispatcher, NitroEvent } from '@nitrots/nitro-renderer';

export const DispatchEventHook = (eventDispatcher: IEventDispatcher, event: NitroEvent) => eventDispatcher.dispatchEvent(event);
