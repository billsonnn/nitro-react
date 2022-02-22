import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomEngineObjectEvent, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback, useReducer, useState } from 'react';
import { GetRoomSession } from '../../api';
import { Button } from '../../common';
import { ModToolsEvent } from '../../events/mod-tools/ModToolsEvent';
import { ModToolsOpenRoomChatlogEvent } from '../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { ModToolsOpenRoomInfoEvent } from '../../events/mod-tools/ModToolsOpenRoomInfoEvent';
import { ModToolsOpenUserInfoEvent } from '../../events/mod-tools/ModToolsOpenUserInfoEvent';
import { useRoomEngineEvent } from '../../hooks/events';
import { dispatchUiEvent, useUiEvent } from '../../hooks/events/ui/ui-event';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { ModToolsContextProvider } from './ModToolsContext';
import { ModToolsMessageHandler } from './ModToolsMessageHandler';
import { initialModTools, ModToolsActions, ModToolsReducer } from './reducers/ModToolsReducer';
import { ISelectedUser } from './utils/ISelectedUser';
import { ModToolsChatlogView } from './views/room/ModToolsChatlogView';
import { ModToolsRoomView } from './views/room/ModToolsRoomView';
import { ModToolsTicketsView } from './views/tickets/ModToolsTicketsView';
import { ModToolsUserChatlogView } from './views/user/ModToolsUserChatlogView';
import { ModToolsUserView } from './views/user/ModToolsUserView';

export const ModToolsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ selectedUser, setSelectedUser] = useState<ISelectedUser>(null);
    const [ isTicketsVisible, setIsTicketsVisible ] = useState(false);
    const [ modToolsState, dispatchModToolsState ] = useReducer(ModToolsReducer, initialModTools);
    const { currentRoomId = null, openRooms = null, openRoomChatlogs = null, openUserChatlogs = null, openUserInfo = null } = modToolsState;

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
        }
    }, []);

    useUiEvent(ModToolsEvent.SHOW_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.HIDE_MOD_TOOLS, onModToolsEvent);
    useUiEvent(ModToolsEvent.TOGGLE_MOD_TOOLS, onModToolsEvent);
    
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

    return (
        <ModToolsContextProvider value={ { modToolsState, dispatchModToolsState } }>
            <ModToolsMessageHandler />
            { isVisible &&
                <NitroCardView uniqueKey="mod-tools" className="nitro-mod-tools" simple={ false }>
                    <NitroCardHeaderView headerText={ 'Mod Tools' } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView className="text-black" gap={ 1 }>
                        <Button gap={ 1 } onClick={ event => handleClick('toggle_room') } disabled={ !currentRoomId }>
                            <FontAwesomeIcon icon="home" /> Room Tool
                        </Button>
                        <Button gap={ 1 } onClick={ event => handleClick('toggle_room_chatlog') } disabled={ !currentRoomId }>
                            <FontAwesomeIcon icon="comments" /> Chatlog Tool
                        </Button>
                        <Button gap={ 1 } onClick={ () => handleClick('toggle_user_info') } disabled={ !selectedUser }>
                            <FontAwesomeIcon icon="user" /> User: { selectedUser ? selectedUser.username : '' }
                        </Button>
                        <Button gap={ 1 } onClick={ () => setIsTicketsVisible(value => !value) }>
                            <FontAwesomeIcon icon="exclamation-circle" /> Report Tool
                        </Button>
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
