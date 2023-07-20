import { NitroConfiguration, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfiguration } from '../../api';
import { LayoutAvatarImageView } from '../../common';
import { useRoomSessionManagerEvent, useSessionInfo } from '../../hooks';
import { WidgetSlotView } from './views/widgets/WidgetSlotView';

const widgetSlotCount = 7;

export const HotelView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true);
    const { userFigure = null } = useSessionInfo();

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED ], event =>
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
    });

    if(!isVisible) return null;

    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const background = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['background']);
    const sun = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['sun']);
    const drape = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['drape']);
    const left = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['left']);
    const rightRepeat = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['right.repeat']);
    const right = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['right']);

    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>
            <div className="container h-100 py-3 overflow-hidden landing-widgets">
                <div className="row h-100">
                    <div className="col-9 h-100 d-flex flex-column">
                        <WidgetSlotView
                            widgetSlot={ 1 }
                            widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 1 + '.widget'] }
                            widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 1 + '.conf'] }
                            className="col-6"
                        />
                        <div className="col-12 row mx-0">
                            <WidgetSlotView
                                widgetSlot={ 2 }
                                widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 2 + '.widget'] }
                                widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 2 + '.conf'] }
                                className="col-7"
                            />
                            <WidgetSlotView
                                widgetSlot={ 3 }
                                widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 3 + '.widget'] }
                                widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 3 + '.conf'] }
                                className="col-5"
                            />
                            <WidgetSlotView
                                widgetSlot={ 4 }
                                widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 4 + '.widget'] }
                                widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 4 + '.conf'] }
                                className="col-7"
                            />
                            <WidgetSlotView
                                widgetSlot={ 5 }
                                widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 5 + '.widget'] }
                                widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 5 + '.conf'] }
                                className="col-5"
                            />
                        </div>
                        <WidgetSlotView
                            widgetSlot={ 6 }
                            widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 6 + '.widget'] }
                            widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 6 + '.conf'] }
                            className="mt-auto"
                        />
                    </div>
                    <div className="col-3 h-100">
                        <WidgetSlotView
                            widgetSlot={ 7 }
                            widgetType={ GetConfiguration('hotelview')['widgets']['slot.' + 7 + '.widget'] }
                            widgetConf={ GetConfiguration('hotelview')['widgets']['slot.' + 7 +'.conf'] }
                        />
                    </div>
                </div>
            </div>
            <div className="background position-absolute" style={ (background && background.length) ? { backgroundImage: `url(${ background })` } : {} } />
            <div className="sun position-absolute" style={ (sun && sun.length) ? { backgroundImage: `url(${ sun })` } : {} } />
            <div className="drape position-absolute" style={ (drape && drape.length) ? { backgroundImage: `url(${ drape })` } : {} } />
            <div className="left position-absolute" style={ (left && left.length) ? { backgroundImage: `url(${ left })` } : {} } />
            <div className="right-repeat position-absolute" style={ (rightRepeat && rightRepeat.length) ? { backgroundImage: `url(${ rightRepeat })` } : {} } />
            <div className="right position-absolute" style={ (right && right.length) ? { backgroundImage: `url(${ right })` } : {} } />
            { GetConfiguration('hotelview')['show.avatar'] && (
                <div className="avatar-image">
                    <LayoutAvatarImageView figure={ userFigure } direction={ 2 } />
                </div>
            ) }
        </div>
    );
}
