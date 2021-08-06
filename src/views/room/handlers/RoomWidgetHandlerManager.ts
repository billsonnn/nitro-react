import { IEventDispatcher, IRoomSession, NitroEvent, RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { IRoomWidgetHandler } from './IRoomWidgetHandler';
import { IRoomWidgetHandlerManager } from './IRoomWidgetHandlerManager';

export class RoomWidgetHandlerManager implements IRoomWidgetHandlerManager
{
    private _roomSession: IRoomSession;
    private _eventDispatcher: IEventDispatcher;
    private _handlers: IRoomWidgetHandler[] = [];
    private _eventMap: Map<string, IRoomWidgetHandler[]> = new Map();
    private _messageMap: Map<string, IRoomWidgetHandler[]> = new Map();

    constructor(roomSession: IRoomSession, eventDispatcher: IEventDispatcher)
    {
        this._roomSession = roomSession;
        this._eventDispatcher = eventDispatcher;
    }

    public registerHandler(handler: IRoomWidgetHandler): void
    {
        const eventTypes = handler.eventTypes;

        eventTypes.push(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, RoomEngineTriggerWidgetEvent.CLOSE_WIDGET);

        if(eventTypes && eventTypes.length)
        {
            for(const name of eventTypes)
            {
                if(!name) continue;

                let events = this._eventMap.get(name);

                if(!events)
                {
                    events = [];

                    this._eventMap.set(name, events);
                }

                events.push(handler);
            }
        }

        const messageTypes = handler.messageTypes;

        if(messageTypes && messageTypes.length)
        {
            for(const name of messageTypes)
            {
                if(!name) continue;

                let messages = this._messageMap.get(name);

                if(!messages)
                {
                    messages = [];

                    this._messageMap.set(name, messages);
                }

                messages.push(handler);
            }
        }

        handler.container = this;

        this._handlers.push(handler);
    }

    public processEvent(event: NitroEvent): void
    {
        const handlers = this._eventMap.get(event.type);

        if(!handlers || !handlers.length) return null;

        for(const handler of handlers)
        {
            if(!handler) continue;

            let dispatch = true;

            if((event.type === RoomEngineTriggerWidgetEvent.OPEN_WIDGET) || (event.type === RoomEngineTriggerWidgetEvent.CLOSE_WIDGET))
            {
                if(event instanceof RoomEngineTriggerWidgetEvent)
                {
                    dispatch = (handler.type === event.widget);
                }
            }
            
            if(dispatch) handler.processEvent(event);
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        const handlers = this._messageMap.get(message.type);

        if(!handlers || !handlers.length) return null;

        for(const handler of handlers)
        {
            if(!handler) continue;

            const update = handler.processWidgetMessage(message);

            if(!update) continue;

            return update;
        }

        return null;
    }

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }

    public get eventDispatcher(): IEventDispatcher
    {
        return this._eventDispatcher;
    }
}
