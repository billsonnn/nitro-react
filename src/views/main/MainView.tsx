import { Nitro, RoomSessionEvent } from 'nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { FadeTransition } from '../../transitions/FadeTransition';
import { HotelView } from '../hotel-view/HotelView';
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
        <div>
            { landingViewVisible && <HotelView /> }
            <RoomHostView />
            <NavigatorView />
            <RightSideView />
            <FadeTransition inProp={ isReady } timeout={ 300 }>
                <ToolbarView />
            </FadeTransition>
        </div>
    );
}
