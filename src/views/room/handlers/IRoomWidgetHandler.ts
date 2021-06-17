import { IEventDispatcher, IRoomSession, NitroEvent } from 'nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';

export interface IRoomWidgetHandler
{
    processEvent: (event: NitroEvent) => void;
    processWidgetMessage: (message: RoomWidgetMessage) => RoomWidgetUpdateEvent;
    roomSession: IRoomSession;
    eventDispatcher: IEventDispatcher;
    eventTypes: string[];
    messageTypes: string[];
}
