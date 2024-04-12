import { GetConfiguration, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetConfigurationValue } from '../../api';
import { LayoutAvatarImageView } from '../../common';
import { useNitroEvent, useSessionInfo } from '../../hooks';
import { WidgetSlotView } from './views/widgets/WidgetSlotView';

const widgetSlotCount = 7;

export const HotelView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true);
    const { userFigure = null } = useSessionInfo();

    useNitroEvent<RoomSessionEvent>([
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

    const backgroundColor = GetConfigurationValue('hotelview')['images']['background.colour'];
    const background = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['background']);
    const sun = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['sun']);
    const drape = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['drape']);
    const left = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['left']);
    const rightRepeat = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['right.repeat']);
    const right = GetConfiguration().interpolate(GetConfigurationValue('hotelview')['images']['right']);

    return (
        <div className="nitro-hotel-view" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>
            <div className="container h-100 py-3 overflow-hidden landing-widgets">
                <div className="row h-100">
                    <div className="col-9 h-100 flex flex-column">
                        <WidgetSlotView
                            className="col-6"
                            widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 1 + '.conf'] }
                            widgetSlot={ 1 }
                            widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 1 + '.widget'] }
                        />
                        <div className="col-12 row mx-0">
                            <WidgetSlotView
                                className="col-7"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 2 + '.conf'] }
                                widgetSlot={ 2 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 2 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-5"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 3 + '.conf'] }
                                widgetSlot={ 3 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 3 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-7"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 4 + '.conf'] }
                                widgetSlot={ 4 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 4 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-5"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 5 + '.conf'] }
                                widgetSlot={ 5 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 5 + '.widget'] }
                            />
                        </div>
                        <WidgetSlotView
                            className="mt-auto"
                            widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 6 + '.conf'] }
                            widgetSlot={ 6 }
                            widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 6 + '.widget'] }
                        />
                    </div>
                    <div className="col-3 h-100">
                        <WidgetSlotView
                            widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 7 +'.conf'] }
                            widgetSlot={ 7 }
                            widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 7 + '.widget'] }
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
            { GetConfigurationValue('hotelview')['show.avatar'] && (
                <div className="avatar-image">
                    <LayoutAvatarImageView direction={ 2 } figure={ userFigure } />
                </div>
            ) }
        </div>
    );
}
