import { IEventDispatcher, IRoomSession } from 'nitro-renderer';
import { ProviderProps } from 'react';
import { IRoomWidgetHandlerManager } from '../handlers';

export interface IRoomContext
{
    roomSession: IRoomSession;
    eventDispatcher: IEventDispatcher;
    widgetHandler: IRoomWidgetHandlerManager;
}

export interface RoomContextProps extends ProviderProps<IRoomContext>
{

}
