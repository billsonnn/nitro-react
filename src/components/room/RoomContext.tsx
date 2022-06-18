import { IEventDispatcher, IRoomSession } from '@nitrots/nitro-renderer';
import { createContext, FC, ProviderProps, useContext } from 'react';
import { IRoomWidgetHandlerManager } from '../../api';

interface IRoomContext
{
    roomSession: IRoomSession;
    eventDispatcher: IEventDispatcher;
    widgetHandler: IRoomWidgetHandlerManager;
}

const RoomContext = createContext<IRoomContext>({
    roomSession: null,
    eventDispatcher: null,
    widgetHandler: null
});

export const RoomContextProvider: FC<ProviderProps<IRoomContext>> = props =>
{
    return <RoomContext.Provider value={ props.value }>{ props.children }</RoomContext.Provider>
}

export const useRoomContext = () => useContext(RoomContext);
