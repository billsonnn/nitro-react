import { HabboWebTools, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetCommunication, RemoveLinkEventTracker } from '../../api';
import { Base } from '../../common';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { TransitionAnimation, TransitionAnimationTypes } from '../../layout';
import { CampaignView } from '../../views/campaign/CampaignView';
import { FloorplanEditorView } from '../../views/floorplan-editor/FloorplanEditorView';
import { FriendsView } from '../../views/friends/FriendsView';
import { HcCenterView } from '../../views/hc-center/HcCenterView';
import { HotelView } from '../../views/hotel-view/HotelView';
import { NitropediaView } from '../../views/nitropedia/NitropediaView';
import { AchievementsView } from '../achievements/AchievementsView';
import { AvatarEditorView } from '../avatar-editor/AvatarEditorView';
import { CameraWidgetView } from '../camera/CameraWidgetView';
import { CatalogView } from '../catalog/CatalogView';
import { ChatHistoryView } from '../chat-history/ChatHistoryView';
import { GroupsView } from '../groups/GroupsView';
import { GuideToolView } from '../guide-tool/GuideToolView';
import { HelpView } from '../help/HelpView';
import { InventoryView } from '../inventory/InventoryView';
import { ModToolsView } from '../mod-tools/ModToolsView';
import { NavigatorView } from '../navigator/NavigatorView';
import { RightSideView } from '../right-side/RightSideView';
import { RoomHostView } from '../room-host/RoomHostView';
import { ToolbarView } from '../toolbar/ToolbarView';
import { UserProfileView } from '../user-profile/UserProfileView';
import { UserSettingsView } from '../user-settings/UserSettingsView';
import { WiredView } from '../wired/WiredView';

export const MainView: FC<{}> = props =>
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
        <Base fit>
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
            <GuideToolView />
            <HcCenterView />
            <CampaignView />
        </Base>
    );
}
