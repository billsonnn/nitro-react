import { RoomEngineEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { ModToolsOpenRoomInfoEvent } from '../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { ModToolsSelectUserEvent } from '../../events/mod-tools/ModToolsSelectUserEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ModToolsContextProvider } from './context/ModToolsContext';
import { ModToolsViewProps } from './ModToolsView.types';
import { initialModTools, ModToolsActions, ModToolsReducer } from './reducers/ModToolsReducer';
import { ModToolsRoomView } from './views/room/ModToolsRoomView';
import { ModToolsTicketsView } from './views/tickets/ModToolsTicketsView';
import { ModToolsUserView } from './views/user/ModToolsUserView';

export const ModToolsView: FC<ModToolsViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ modToolsState, dispatchModToolsState ] = useReducer(ModToolsReducer, initialModTools);
    const { currentRoomId = null, selectedUser = null, openRooms = null, openChatlogs = null } = modToolsState;

    const [ isUserVisible, setIsUserVisible ] = useState(false);
    const [ isTicketsVisible, setIsTicketsVisible ] = useState(false);

    const onModToolsEvent = useCallback((event: ModToolsEvent) =>
    {
        switch(event.type)
        {
            case ModToolsEvent.SHOW_MOD_TOOLS:
                setIsVisible(true);
                return;
            case ModToolsEvent.HIDE_MOD_TOOLS:
                setIsVisible(false);
                return;   
            case ModToolsEvent.TOGGLE_MOD_TOOLS:
                setIsVisible(value => !value);
                return;
            case ModToolsEvent.SELECT_USER: {
                const castedEvent = (event as ModToolsSelectUserEvent);
                
                dispatchModToolsState({
                    type: ModToolsActions.SET_SELECTED_USER,
                    payload: {
                        selectedUser: {
                            webID: castedEvent.webID,
                            name: castedEvent.name
                        }
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_ROOM_INFO: {
                const castedEvent = (event as ModToolsOpenRoomInfoEvent);
                
                if(openRooms && openRooms.includes(castedEvent.roomId)) return;
                
                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOMS,
                    payload: {
                        openRooms: [...openRooms, castedEvent.roomId]
                    }
                });
                return;
            }
        }
    }, [ dispatchModToolsState, setIsVisible, openRooms ]);

    useUiEvent(ModToolsEvent.SHOW_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.HIDE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.TOGGLE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.SELECT_USER, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_ROOM_INFO, onModToolsEvent);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                dispatchModToolsState({
                    type: ModToolsActions.SET_CURRENT_ROOM_ID,
                    payload: {
                        currentRoomId: event.roomId
                    }
                });
                return;
            case RoomEngineEvent.DISPOSED:
                dispatchModToolsState({
                    type: ModToolsActions.SET_CURRENT_ROOM_ID,
                    payload: {
                        currentRoomId: null
                    }
                });
                return;
        }
    }, [ dispatchModToolsState ]);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'toggle_room': {
                if(!openRooms)
                {
                    dispatchUiEvent(new ModToolsOpenRoomInfoEvent(currentRoomId));
                    return;
                }

                const itemIndex = openRooms.indexOf(currentRoomId);

                if(itemIndex > -1)
                {
                    handleClick('close_room', currentRoomId.toString());
                }
                else
                {
                    dispatchUiEvent(new ModToolsOpenRoomInfoEvent(currentRoomId));
                }
                return;
            }
            case 'close_room': {
                const itemIndex = openRooms.indexOf(Number(value));

                const clone = Array.from(openRooms);
                clone.splice(itemIndex, 1);

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOMS,
                    payload: {
                        openRooms: clone
                    }
                });                
                return;
            }
            case 'close_chatlog': {
                const itemIndex = openChatlogs.indexOf(Number(value));

                const clone = Array.from(openChatlogs);
                clone.splice(itemIndex, 1);

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_CHATLOGS,
                    payload: {
                        openChatlogs: clone
                    }
                });                
                return;
            }
        }
    }, [ dispatchModToolsState, openRooms, openChatlogs, currentRoomId ]);

    useEffect(() =>
    {
        if(!isVisible) return;
    }, [ isVisible ]);

    return (
        <ModToolsContextProvider value={ { modToolsState, dispatchModToolsState } }>
            { isVisible &&
                <NitroCardView uniqueKey="mod-tools" className="nitro-mod-tools" simple={ true }>
                    <NitroCardHeaderView headerText={ 'Mod Tools' } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView className="text-black">
                        <button className="btn btn-primary w-100 mb-2" onClick={ () => handleClick('toggle_room') } disabled={ !currentRoomId }><i className="fas fa-home"></i> Room Tool</button>
                        <button className="btn btn-primary w-100 mb-2" onClick={ () => {} } disabled={ !currentRoomId }><i className="fas fa-comments"></i> Chatlog Tool</button>
                        <button className="btn btn-primary w-100 mb-2" onClick={ () => setIsUserVisible(value => !value) } disabled={ !selectedUser }><i className="fas fa-user"></i> User: { selectedUser ? selectedUser.name : '' }</button>
                        <button className="btn btn-primary w-100" onClick={ () => setIsTicketsVisible(value => !value) }><i className="fas fa-exclamation-circle"></i> Report Tool</button>
                    </NitroCardContentView>
                </NitroCardView> }
            { openRooms && openRooms.map(roomId =>
                {
                    return <ModToolsRoomView key={ roomId } roomId={ roomId } onCloseClick={ () => handleClick('close_room', roomId.toString()) } />;
                }) }
            
            { isUserVisible && <ModToolsUserView /> }
            { isTicketsVisible && <ModToolsTicketsView /> }
        </ModToolsContextProvider>
    );
}
