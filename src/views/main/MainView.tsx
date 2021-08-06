import { RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetCommunication } from '../../api';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { AchievementsView } from '../achievements/AchievementsView';
import { AvatarEditorView } from '../avatar-editor/AvatarEditorView';
import { CatalogView } from '../catalog/CatalogView';
import { FriendListView } from '../friend-list/FriendListView';
import { HotelView } from '../hotel-view/HotelView';
import { InventoryView } from '../inventory/InventoryView';
import { ModToolsView } from '../mod-tools/ModToolsView';
import { NavigatorView } from '../navigator/NavigatorView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { RightSideView } from '../right-side/RightSideView';
import { RoomHostView } from '../room-host/RoomHostView';
import { ToolbarView } from '../toolbar/ToolbarView';
import { WiredView } from '../wired/WiredView';
import { MainViewProps } from './MainView.types';

export const MainView: FC<MainViewProps> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ landingViewVisible, setLandingViewVisible ] = useState(true);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setLandingViewVisible(false);
                return;
            case RoomSessionEvent.ENDED:
                setLandingViewVisible(event.openLandingView);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    useEffect(() =>
    {
        setIsReady(true);

        GetCommunication().connection.onReady();
    }, []);

    return (
        <div className="nitro-main">
            { landingViewVisible && <HotelView /> }
            <ToolbarView isInRoom={ !landingViewVisible } />
            <ModToolsView />
            <RoomHostView />
            <WiredView />
            <AvatarEditorView />
            <AchievementsView />
            <NavigatorView />
            <InventoryView />
            <CatalogView />
            <FriendListView />
            <RightSideView />
            <NotificationCenterView />
        </div>
    );
}
