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
        <div className="block fixed w-full h-[calc(100%-55px)] bg-[black] text-[#000]" style={ (backgroundColor && backgroundColor) ? { background: backgroundColor } : {} }>
            <div className="container h-full py-3 overflow-hidden z-10 relative">
                <div className="flex flex-wrap h-full justify-center">
                    <div className="grid-rows-3 h-full grid w-min">
                        <WidgetSlotView
                            className="grid grid-cols-2 gap-12                            "
                            widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 1 + '.conf'] }
                            widgetSlot={ 1 }
                            widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 1 + '.widget'] }
                        />
                        <div className="grid grid-cols-12">
                            <WidgetSlotView
                                className="col-span-7"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 2 + '.conf'] }
                                widgetSlot={ 2 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 2 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-span-5"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 3 + '.conf'] }
                                widgetSlot={ 3 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 3 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-span-7"
                                widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 4 + '.conf'] }
                                widgetSlot={ 4 }
                                widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 4 + '.widget'] }
                            />
                            <WidgetSlotView
                                className="col-span-5"
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
                    <div className="col-span-3 h-full">
                        <WidgetSlotView
                            widgetConf={ GetConfigurationValue('hotelview')['widgets']['slot.' + 7 + '.conf'] }
                            widgetSlot={ 7 }
                            widgetType={ GetConfigurationValue('hotelview')['widgets']['slot.' + 7 + '.widget'] }
                        />
                    </div>
                </div>
            </div>
            <div className="background absolute top-[0] h-full w-full bg-left bg-repeat-y" style={ (background && background.length) ? { backgroundImage: `url(${ background })` } : {} } />
            <div className="sun absolute w-full h-full top-[0] left-[0] right-[0] m-auto bg-no-repeat bg-[top_center]" style={ (sun && sun.length) ? { backgroundImage: `url(${ sun })` } : {} } />
            <div className="drape absolute w-full h-full left-[0] top-[0] [animation-iteration-count:1] [animation-name:slideDown] [animation-duration:1s] bg-no-repeat" style={ (drape && drape.length) ? { backgroundImage: `url(${ drape })` } : {} } />
            <div className="left absolute top-[0] right-[0] bottom-[0] left-[0] [animation-iteration-count:1] [animation-name:slideUp] [animation-duration:1s] bg-no-repeat bg-left-bottom" style={ (left && left.length) ? { backgroundImage: `url(${ left })` } : {} } />
            <div className="right-repeat absolute w-full h-full right-[0] top-[0] bg-no-repeat bg-right-top" style={ (rightRepeat && rightRepeat.length) ? { backgroundImage: `url(${ rightRepeat })` } : {} } />
            <div className="right absolute w-full h-full right-[0] bottom-[0] [animation-iteration-count:1] [animation-name:slideUp] [animation-duration:1s] bg-no-repeat bg-right-bottom" style={ (right && right.length) ? { backgroundImage: `url(${ right })` } : {} } />
            { GetConfigurationValue('hotelview')['show.avatar'] && (
                <div>
                    <LayoutAvatarImageView direction={ 2 } figure={ userFigure } />
                </div>
            ) }
        </div>
    );
};
