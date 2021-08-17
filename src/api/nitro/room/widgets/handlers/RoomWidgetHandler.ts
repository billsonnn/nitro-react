import { NitroEvent } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateEvent } from '../events';
import { RoomWidgetMessage } from '../messages';
import { IRoomWidgetHandler } from './IRoomWidgetHandler';
import { IRoomWidgetHandlerManager } from './IRoomWidgetHandlerManager';

export abstract class RoomWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerManager = null;

    public abstract processEvent(event: NitroEvent): void;
    
    public abstract processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;

    public get container(): IRoomWidgetHandlerManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerManager)
    {
        this._container = container;
    }

    public abstract get type(): string;

    public abstract get eventTypes(): string[];

    public abstract get messageTypes(): string[];
}
