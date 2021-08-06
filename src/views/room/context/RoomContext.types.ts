import { IEventDispatcher, IRoomSession } from '@nitrots/nitro-renderer';
import { ProviderProps } from 'react';
import { IRoomWidgetHandlerManager } from '../handlers';

export interface IRoomContext
{
    roomSession: IRoomSession;
    canvasId: number;
    eventDispatcher: IEventDispatcher;
    widgetHandler: IRoomWidgetHandlerManager;
}

export interface RoomContextProps extends ProviderProps<IRoomContext>
{

}
