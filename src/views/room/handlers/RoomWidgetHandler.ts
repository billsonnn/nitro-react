import { IEventDispatcher, IRoomSession, NitroEvent } from 'nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { IRoomWidgetHandler } from './IRoomWidgetHandler';

export abstract class RoomWidgetHandler implements IRoomWidgetHandler
{
    private _roomSession: IRoomSession = null;
    private _eventDispatcher: IEventDispatcher = null;

    public abstract processEvent(event: NitroEvent): void;
    
    public abstract processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }

    public set roomSession(roomSession: IRoomSession)
    {
        this._roomSession = roomSession;
    }

    public get eventDispatcher(): IEventDispatcher
    {
        return this._eventDispatcher;
    }

    public set eventDispatcher(eventDispatcher: IEventDispatcher)
    {
        this._eventDispatcher = eventDispatcher;
    }

    public abstract get eventTypes(): string[];

    public abstract get messageTypes(): string[];
}
