import { Nitro, RoomSessionEvent } from 'nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { TransitionAnimation } from '../../layout/transitions/TransitionAnimation';
import { TransitionAnimationTypes } from '../../layout/transitions/TransitionAnimation.types';
import { AvatarEditorView } from '../avatar-editor/AvatarEditorView';
import { CatalogView } from '../catalog/CatalogView';
import { FriendListView } from '../friend-list/FriendListView';
import { HotelView } from '../hotel-view/HotelView';
import { InventoryView } from '../inventory/InventoryView';
import { NavigatorView } from '../navigator/NavigatorView';
import { RightSideView } from '../right-side/RightSideView';
import { RoomHostView } from '../room-host/RoomHostView';
import { ToolbarView } from '../toolbar/ToolbarView';
import { MainViewProps } from './MainView.types';

export function MainView(props: MainViewProps): JSX.Element
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

        Nitro.instance.communication.connection.onReady();
    }, []);

    return (
        <div className="nitro-main">
            { landingViewVisible && <HotelView /> }
            <RoomHostView />
            <TransitionAnimation className="nitro-toolbar-container" type={ TransitionAnimationTypes.FADE_UP } inProp={ isReady } timeout={ 300 }>
                <ToolbarView isInRoom={ !landingViewVisible } />
            </TransitionAnimation>
            <AvatarEditorView />
            <NavigatorView />
            <InventoryView />
            <CatalogView />
            <FriendListView />
            <RightSideView />
        </div>
    );
}
