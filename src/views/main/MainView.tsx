import { HabboWebTools, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetCommunication, RemoveLinkEventTracker } from '../../api';
import { AchievementsView } from '../../components/achievements/AchievementsView';
import { AvatarEditorView } from '../../components/avatar-editor/AvatarEditorView';
import { CameraWidgetView } from '../../components/camera/CameraWidgetView';
import { CatalogView } from '../../components/catalog/CatalogView';
import { ChatHistoryView } from '../../components/chat-history/ChatHistoryView';
import { GroupsView } from '../../components/groups/GroupsView';
import { HelpView } from '../../components/help/HelpView';
import { InventoryView } from '../../components/inventory/InventoryView';
import { ModToolsView } from '../../components/mod-tools/ModToolsView';
import { NavigatorView } from '../../components/navigator/NavigatorView';
import { RightSideView } from '../../components/right-side/RightSideView';
import { ToolbarView } from '../../components/toolbar/ToolbarView';
import { UserProfileView } from '../../components/user-profile/UserProfileView';
import { UserSettingsView } from '../../components/user-settings/UserSettingsView';
import { WiredView } from '../../components/wired/WiredView';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { TransitionAnimation, TransitionAnimationTypes } from '../../layout';
import { CampaignView } from '../campaign/CampaignView';
import { FloorplanEditorView } from '../floorplan-editor/FloorplanEditorView';
import { FriendsView } from '../friends/FriendsView';
import { HcCenterView } from '../hc-center/HcCenterView';
import { HotelView } from '../hotel-view/HotelView';
import { NitropediaView } from '../nitropedia/NitropediaView';
import { RoomHostView } from '../room-host/RoomHostView';
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

    const onLinkReceived = useCallback((link: string) =>
    {
        const parts = link.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'open':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        case 'credits':
                            //HabboWebTools.openWebPageAndMinimizeClient(this._windowManager.getProperty(ExternalVariables.WEB_SHOP_RELATIVE_URL));
                            break;
                        default: {
                            const name = parts[2];
                            HabboWebTools.openHabblet(name);
                        }
                    }
                }
                return;
        }
    }, []);

    useEffect(() =>
    {
        setIsReady(true);

        GetCommunication().connection.onReady();
    }, []);

    useEffect(() =>
    {
        const linkTracker = { linkReceived: onLinkReceived, eventUrlPrefix: 'habblet/' };
        AddEventLinkTracker(linkTracker);

        return () =>
        {
            RemoveLinkEventTracker(linkTracker);
        }
    }, [onLinkReceived]);

    return (
        <div className="nitro-main">
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ landingViewVisible } timeout={ 300 }>
                <HotelView />
            </TransitionAnimation>
            <ToolbarView isInRoom={ !landingViewVisible } />
            <ModToolsView />
            <RoomHostView />
            <ChatHistoryView />
            <WiredView />
            <AvatarEditorView />
            <AchievementsView />
            <NavigatorView />
            <InventoryView />
            <CatalogView />
            <FriendsView />
            <RightSideView />
            <UserSettingsView />
            <UserProfileView />
            <GroupsView />
            <CameraWidgetView />
            <HelpView />
            <FloorplanEditorView />
            <NitropediaView />
            <HcCenterView />
            <CampaignView />
        </div>
    );
}
