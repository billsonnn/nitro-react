import { NitroEvent } from 'nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { IRoomWidgetHandlerManager } from './IRoomWidgetHandlerManager';

export interface IRoomWidgetHandler
{
    processEvent: (event: NitroEvent) => void;
    processWidgetMessage: (message: RoomWidgetMessage) => RoomWidgetUpdateEvent;
    container: IRoomWidgetHandlerManager;
    eventTypes: string[];
    messageTypes: string[];
}
