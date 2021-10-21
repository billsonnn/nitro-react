import { ModeratorInitMessageEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback, useReducer, useState } from 'react';
import { GetRoomSession } from '../../api';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { ModToolsOpenRoomChatlogEvent } from '../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { ModToolsOpenRoomInfoEvent } from '../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { ModToolsOpenUserChatlogEvent } from '../../events/mod-tools/ModToolsOpenUserChatlogEvent';
import { ModToolsOpenUserInfoEvent } from '../../events/mod-tools/ModToolsOpenUserInfoEvent';
import { CreateMessageHook } from '../../hooks';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ModToolsContextProvider } from './context/ModToolsContext';
import { ModToolsViewProps } from './ModToolsView.types';
import { initialModTools, ModToolsActions, ModToolsReducer } from './reducers/ModToolsReducer';
import { ISelectedUser } from './utils/ISelectedUser';
import { ModToolsChatlogView } from './views/room/room-chatlog/ModToolsChatlogView';
import { ModToolsRoomView } from './views/room/room-tools/ModToolsRoomView';
import { ModToolsTicketsView } from './views/tickets/ModToolsTicketsView';
import { ModToolsUserChatlogView } from './views/user/user-chatlog/ModToolsUserChatlogView';
import { ModToolsUserView } from './views/user/user-info/ModToolsUserView';

export const ModToolsView: FC<ModToolsViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ modToolsState, dispatchModToolsState ] = useReducer(ModToolsReducer, initialModTools);
    const { currentRoomId = null, openRooms = null, openRoomChatlogs = null, openUserChatlogs = null, openUserInfo = null } = modToolsState;
    const [ selectedUser, setSelectedUser] = useState<ISelectedUser>(null);
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
            case ModToolsEvent.OPEN_ROOM_INFO: {
                const castedEvent = (event as ModToolsOpenRoomInfoEvent);
                
                if(openRooms && openRooms.includes(castedEvent.roomId)) return;
                
                const rooms = openRooms || [];
                
                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOMS,
                    payload: {
                        openRooms: [...rooms, castedEvent.roomId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_ROOM_CHATLOG: {
                const castedEvent = (event as ModToolsOpenRoomChatlogEvent); 

                if(openRoomChatlogs && openRoomChatlogs.includes(castedEvent.roomId)) return;

                const chatlogs = openRoomChatlogs || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOM_CHATLOGS,
                    payload: {
                        openRoomChatlogs: [...chatlogs, castedEvent.roomId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_USER_INFO: {
                const castedEvent = (event as ModToolsOpenUserInfoEvent);

                if(openUserInfo && openUserInfo.includes(castedEvent.userId)) return;

                const userInfo = openUserInfo || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USERINFO,
                    payload: {
                        openUserInfo: [...userInfo, castedEvent.userId]
                    }
                });
                return;
            }
            case ModToolsEvent.OPEN_USER_CHATLOG: {
                const castedEvent = (event as ModToolsOpenUserChatlogEvent);

                if(openUserChatlogs && openUserChatlogs.includes(castedEvent.userId)) return;

                const userChatlog = openUserChatlogs || [];

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USER_CHATLOGS,
                    payload: {
                        openUserChatlogs: [...userChatlog, castedEvent.userId]
                    }
                });
                return;
            }
        }
    }, [openRooms, openRoomChatlogs, openUserInfo, openUserChatlogs]);

    useUiEvent(ModToolsEvent.SHOW_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.HIDE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.TOGGLE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_ROOM_INFO, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_ROOM_CHATLOG, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_USER_INFO, onModToolsEvent);
    useUiEvent(ModToolsEvent.OPEN_USER_CHATLOG, onModToolsEvent);

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

    const onRoomEngineObjectEvent = useCallback((event: RoomEngineObjectEvent) =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        const roomSession = GetRoomSession();

        if(!roomSession) return;

        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData) return;

        setSelectedUser({ userId: userData.webID, username: userData.name });
    }, []);
    
    useRoomEngineEvent(RoomEngineObjectEvent.SELECTED, onRoomEngineObjectEvent);

    const onModeratorInitMessageEvent = useCallback((event: ModeratorInitMessageEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const data = parser.data;

        dispatchModToolsState({
            type: ModToolsActions.SET_INIT_DATA,
            payload: {
                settings: data
            }
        });
        console.log(parser);   
    }, []);

    CreateMessageHook(ModeratorInitMessageEvent, onModeratorInitMessageEvent);

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

                if(openRooms.indexOf(currentRoomId) > -1)
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
            case 'toggle_room_chatlog': {
                if(!openRoomChatlogs)
                {
                    dispatchUiEvent(new ModToolsOpenRoomChatlogEvent(currentRoomId));
                    return;
                }

                if(openRoomChatlogs.indexOf(currentRoomId) > -1)
                {
                    handleClick('close_room_chatlog', currentRoomId.toString());
                }
                else
                {
                    dispatchUiEvent(new ModToolsOpenRoomChatlogEvent(currentRoomId));
                }
                return;
            }
            case 'close_room_chatlog': {
                const itemIndex = openRoomChatlogs.indexOf(Number(value));

                const clone = Array.from(openRoomChatlogs);
                clone.splice(itemIndex, 1);

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_ROOM_CHATLOGS,
                    payload: {
                        openRoomChatlogs: clone
                    }
                });                
                return;
            }
            case 'toggle_user_info': {

                if(!selectedUser) return;

                const userId = selectedUser.userId;

                if(!openUserInfo)
                {
                    dispatchUiEvent(new ModToolsOpenUserInfoEvent(userId));
                    return;
                }

                if(openUserInfo.indexOf(userId) > -1)
                {
                    handleClick('close_user_info', userId.toString());
                }
                else
                {
                    dispatchUiEvent(new ModToolsOpenUserInfoEvent(userId));
                }
                return;
            }
            case 'close_user_info': {
                const itemIndex = openUserInfo.indexOf(Number(value));

                const clone = Array.from(openUserInfo);
                clone.splice(itemIndex, 1);

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USERINFO,
                    payload: {
                        openUserInfo: clone
                    }
                });                
                return;
            }
            case 'close_user_chatlog': {
                const itemIndex = openUserChatlogs.indexOf(Number(value));

                const clone = Array.from(openUserChatlogs);
                clone.splice(itemIndex, 1);

                dispatchModToolsState({
                    type: ModToolsActions.SET_OPEN_USER_CHATLOGS,
                    payload: {
                        openUserChatlogs: clone
                    }
                });                
                return;
            }
        }
    }, [openRooms, currentRoomId, openRoomChatlogs, selectedUser, openUserInfo, openUserChatlogs]);

    if(!isVisible) return null;

    return (
        <ModToolsContextProvider value={ { modToolsState, dispatchModToolsState } }>
            { isVisible &&
                <NitroCardView uniqueKey="mod-tools" className="nitro-mod-tools" simple={ false }>
                    <NitroCardHeaderView headerText={ 'Mod Tools' } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView className="text-black">
                        <button className="btn btn-primary btn-sm w-100 mb-2" onClick={ () => handleClick('toggle_room') } disabled={ !currentRoomId }><i className="fas fa-home"></i> Room Tool</button>
                        <button className="btn btn-primary btn-sm w-100 mb-2" onClick={ () => handleClick('toggle_room_chatlog') } disabled={ !currentRoomId }><i className="fas fa-comments"></i> Chatlog Tool</button>
                        <button className="btn btn-primary btn-sm w-100 mb-2" onClick={ () => handleClick('toggle_user_info') } disabled={ !selectedUser }><i className="fas fa-user"></i> User: { selectedUser ? selectedUser.username : '' }</button>
                        <button className="btn btn-primary btn-sm w-100" onClick={ () => setIsTicketsVisible(value => !value) }><i className="fas fa-exclamation-circle"></i> Report Tool</button>
                    </NitroCardContentView>
                </NitroCardView> }
            { openRooms && openRooms.map(roomId =>
                {
                    return <ModToolsRoomView key={ roomId } roomId={ roomId } onCloseClick={ () => handleClick('close_room', roomId.toString()) } />;
                }) 
            }
            { openRoomChatlogs && openRoomChatlogs.map(roomId =>
                {
                    return <ModToolsChatlogView key={ roomId } roomId={ roomId } onCloseClick={ () => handleClick('close_room_chatlog', roomId.toString()) } />;
                })
            }
            { openUserInfo && openUserInfo.map(userId =>
                {
                    return <ModToolsUserView key={userId} userId={userId} onCloseClick={ () => handleClick('close_user_info', userId.toString())}/>
                })
            }
            { openUserChatlogs && openUserChatlogs.map(userId =>
                {
                    return <ModToolsUserChatlogView key={userId} userId={userId} onCloseClick={ () => handleClick('close_user_chatlog', userId.toString())}/>
                })
            }
            
            { isTicketsVisible && <ModToolsTicketsView onCloseClick={ () => setIsTicketsVisible(false) } /> }
        </ModToolsContextProvider>
    );
}
