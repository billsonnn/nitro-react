import { createContext, FC, useContext } from 'react';
import { IRoomContext, RoomContextProps } from './RoomContext.types';

const RoomContext = createContext<IRoomContext>({
    roomSession: null,
    canvasId: -1,
    eventDispatcher: null,
    widgetHandler: null
});

export const RoomContextProvider: FC<RoomContextProps> = props =>
{
    return <RoomContext.Provider value={ props.value }>{ props.children }</RoomContext.Provider>
}

export const useRoomContext = () => useContext(RoomContext);
