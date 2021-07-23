import { NitroEvent } from 'nitro-renderer';
import { GetNitroInstance } from '../../../../api';
import { CreateEventDispatcherHook } from '../../event-dispatcher.base';

export function useCameraEvent(type: string, handler: (event: NitroEvent) => void): void
{
    CreateEventDispatcherHook(type, GetNitroInstance().cameraManager.events, handler);
}
