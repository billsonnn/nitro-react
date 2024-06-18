import { AddLinkEventTracker, GetCommunication, HabboWebTools, ILinkEventTracker, RemoveLinkEventTracker, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { TransitionAnimation, TransitionAnimationTypes } from '../common';
import { useNitroEvent } from '../hooks';
import { AchievementsView } from './achievements/AchievementsView';
import { AvatarEditorView } from './avatar-editor';
import { CameraWidgetView } from './camera/CameraWidgetView';
import { CampaignView } from './campaign/CampaignView';
import { CatalogView } from './catalog/CatalogView';
import { ChatHistoryView } from './chat-history/ChatHistoryView';
import { FloorplanEditorView } from './floorplan-editor/FloorplanEditorView';
import { FriendsView } from './friends/FriendsView';
import { GameCenterView } from './game-center/GameCenterView';
import { GroupsView } from './groups/GroupsView';
import { GuideToolView } from './guide-tool/GuideToolView';
import { HcCenterView } from './hc-center/HcCenterView';
import { HelpView } from './help/HelpView';
import { HotelView } from './hotel-view/HotelView';
import { InventoryView } from './inventory/InventoryView';
import { ModToolsView } from './mod-tools/ModToolsView';
import { NavigatorView } from './navigator/NavigatorView';
import { NitropediaView } from './nitropedia/NitropediaView';
import { RightSideView } from './right-side/RightSideView';
import { RoomView } from './room/RoomView';
import { ToolbarView } from './toolbar/ToolbarView';
import { UserProfileView } from './user-profile/UserProfileView';
import { UserSettingsView } from './user-settings/UserSettingsView';
import { WiredView } from './wired/WiredView';

export const MainView: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ landingViewVisible, setLandingViewVisible ] = useState(true);

    useNitroEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event => setLandingViewVisible(false));
    useNitroEvent<RoomSessionEvent>(RoomSessionEvent.ENDED, event => setLandingViewVisible(event.openLandingView));

    useEffect(() =>
    {
        setIsReady(true);

        GetCommunication().connection.ready();
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

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
            },
            eventUrlPrefix: 'habblet/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <>
            <TransitionAnimation inProp={ landingViewVisible } timeout={ 300 } type={ TransitionAnimationTypes.FADE_IN }>
                <HotelView />
            </TransitionAnimation>
            <ToolbarView isInRoom={ !landingViewVisible } />
            <ModToolsView />
            <RoomView />
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
            <NitropediaView />
            <GuideToolView />
            <HcCenterView />
            <CampaignView />
            <GameCenterView />
            <FloorplanEditorView />
        </>
    );
};
