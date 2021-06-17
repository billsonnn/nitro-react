import { IEventDispatcher, NitroEvent } from 'nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { IRoomWidgetHandler } from './IRoomWidgetHandler';

export interface IRoomWidgetHandlerManager
{
    registerHandler(handler: IRoomWidgetHandler): void;
    processEvent(event: NitroEvent): void;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    eventDispatcher: IEventDispatcher;
}
