import { RoomSessionEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetConfiguration, GetNitroInstance } from '../../api';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { HotelViewProps } from './HotelView.types';

export const HotelView: FC<HotelViewProps> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                return;
            case RoomSessionEvent.ENDED:
                setIsVisible(event.openLandingView);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    if(!isVisible) return null;

    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const background      = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['background']);
    const sun             = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['sun']);
    const drape           = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['drape']);
    const left            = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['left']);
    const rightRepeat     = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['right.repeat']);
    const right           = GetNitroInstance().core.configuration.interpolate(GetConfiguration('hotelview')['images']['right']);

    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>
            <div className="background position-absolute" style={ (background && background.length) ? { backgroundImage: `url(${ background })` } : {} } />
            <div className="sun position-absolute" style={ (sun && sun.length) ? { backgroundImage: `url(${ sun })` } : {} } />
            <div className="drape position-absolute" style={ (drape && drape.length) ? { backgroundImage: `url(${ drape })` } : {} } />
            <div className="left position-absolute" style={ (left && left.length) ? { backgroundImage: `url(${ left })` } : {} } />
            <div className="right-repeat position-absolute" style={ (rightRepeat && rightRepeat.length) ? { backgroundImage: `url(${ rightRepeat })` } : {} } />
            <div className="right position-absolute" style={ (right && right.length) ? { backgroundImage: `url(${ right })` } : {} } />
        </div>
    );
}
