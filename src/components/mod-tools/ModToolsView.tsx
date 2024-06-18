import { AddLinkEventTracker, CreateLinkEvent, ILinkEventTracker, RemoveLinkEventTracker, RoomEngineEvent, RoomId, RoomObjectCategory, RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetRoomSession, ISelectedUser } from '../../api';
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { useModTools, useNitroEvent, useObjectSelectedEvent } from '../../hooks';
import { ModToolsChatlogView } from './views/room/ModToolsChatlogView';
import { ModToolsRoomView } from './views/room/ModToolsRoomView';
import { ModToolsTicketsView } from './views/tickets/ModToolsTicketsView';
import { ModToolsUserChatlogView } from './views/user/ModToolsUserChatlogView';
import { ModToolsUserView } from './views/user/ModToolsUserView';

export const ModToolsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ currentRoomId, setCurrentRoomId ] = useState<number>(-1);
    const [ selectedUser, setSelectedUser ] = useState<ISelectedUser>(null);
    const [ isTicketsVisible, setIsTicketsVisible ] = useState(false);
    const { openRooms = [], openRoomChatlogs = [], openUserChatlogs = [], openUserInfos = [], openRoomInfo = null, closeRoomInfo = null, toggleRoomInfo = null, openRoomChatlog = null, closeRoomChatlog = null, toggleRoomChatlog = null, openUserInfo = null, closeUserInfo = null, toggleUserInfo = null, openUserChatlog = null, closeUserChatlog = null, toggleUserChatlog = null } = useModTools();
    const elementRef = useRef<HTMLDivElement>(null);

    useNitroEvent<RoomEngineEvent>([
        RoomEngineEvent.INITIALIZED,
        RoomEngineEvent.DISPOSED
    ], event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                setCurrentRoomId(event.roomId);
                return;
            case RoomEngineEvent.DISPOSED:
                setCurrentRoomId(-1);
                return;
        }
    });

    useObjectSelectedEvent(event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        const roomSession = GetRoomSession();

        if(!roomSession) return;

        const userData = roomSession.userDataManager.getUserDataByIndex(event.id);

        if(!userData || userData.type !== RoomObjectType.USER) return;

        setSelectedUser({ userId: userData.webID, username: userData.name });
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open-room-info':
                        openRoomInfo(Number(parts[2]));
                        return;
                    case 'close-room-info':
                        closeRoomInfo(Number(parts[2]));
                        return;
                    case 'toggle-room-info':
                        toggleRoomInfo(Number(parts[2]));
                        return;
                    case 'open-room-chatlog':
                        openRoomChatlog(Number(parts[2]));
                        return;
                    case 'close-room-chatlog':
                        closeRoomChatlog(Number(parts[2]));
                        return;
                    case 'toggle-room-chatlog':
                        toggleRoomChatlog(Number(parts[2]));
                        return;
                    case 'open-user-info':
                        openUserInfo(Number(parts[2]));
                        return;
                    case 'close-user-info':
                        closeUserInfo(Number(parts[2]));
                        return;
                    case 'toggle-user-info':
                        toggleUserInfo(Number(parts[2]));
                        return;
                    case 'open-user-chatlog':
                        openUserChatlog(Number(parts[2]));
                        return;
                    case 'close-user-chatlog':
                        closeUserChatlog(Number(parts[2]));
                        return;
                    case 'toggle-user-chatlog':
                        toggleUserChatlog(Number(parts[2]));
                        return;
                }
            },
            eventUrlPrefix: 'mod-tools/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ openRoomInfo, closeRoomInfo, toggleRoomInfo, openRoomChatlog, closeRoomChatlog, toggleRoomChatlog, openUserInfo, closeUserInfo, toggleUserInfo, openUserChatlog, closeUserChatlog, toggleUserChatlog ]);

    return (
        <>
            { isVisible &&
                <NitroCardView className="nitro-mod-tools" theme="primary-slim" uniqueKey="mod-tools" windowPosition={ DraggableWindowPosition.TOP_LEFT } >
                    <NitroCardHeaderView headerText={ 'Mod Tools' } onCloseClick={ event => setIsVisible(false) } />
                    <NitroCardContentView className="text-black" gap={ 1 }>
                        <Button className="relative" disabled={ (currentRoomId <= 0) } gap={ 1 } onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-info/${ currentRoomId }`) }>
                            <div className="nitro-icon icon-small-room absolute start-1" /> Room Tool
                        </Button>
                        <Button className="relative" disabled={ (currentRoomId <= 0) } gap={ 1 } innerRef={ elementRef } onClick={ event => CreateLinkEvent(`mod-tools/toggle-room-chatlog/${ currentRoomId }`) }>
                            <div className="nitro-icon icon-chat-history absolute start-1" /> Chatlog Tool
                        </Button>
                        <Button className="relative" disabled={ !selectedUser } gap={ 1 } onClick={ () => CreateLinkEvent(`mod-tools/toggle-user-info/${ selectedUser.userId }`) }>
                            <div className="nitro-icon icon-user absolute start-1" /> User: { selectedUser ? selectedUser.username : '' }
                        </Button>
                        <Button className="relative" gap={ 1 } onClick={ () => setIsTicketsVisible(prevValue => !prevValue) }>
                            <div className="nitro-icon icon-tickets absolute start-1" /> Report Tool
                        </Button>
                    </NitroCardContentView>
                </NitroCardView> }
            { (openRooms.length > 0) && openRooms.map(roomId => <ModToolsRoomView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-info/${ roomId }`) } />) }
            { (openRoomChatlogs.length > 0) && openRoomChatlogs.map(roomId => <ModToolsChatlogView key={ roomId } roomId={ roomId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-room-chatlog/${ roomId }`) } />) }
            { (openUserInfos.length > 0) && openUserInfos.map(userId => <ModToolsUserView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-info/${ userId }`) } />) }
            { (openUserChatlogs.length > 0) && openUserChatlogs.map(userId => <ModToolsUserChatlogView key={ userId } userId={ userId } onCloseClick={ () => CreateLinkEvent(`mod-tools/close-user-chatlog/${ userId }`) } />) }
            { isTicketsVisible && <ModToolsTicketsView onCloseClick={ () => setIsTicketsVisible(false) } /> }
        </>
    );
};
