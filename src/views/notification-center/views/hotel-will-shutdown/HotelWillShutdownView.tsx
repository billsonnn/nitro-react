import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NotificationTrayItemView } from '../tray-item/NotificationTrayItemView';
import { HotelWillShutdownViewProps } from './HotelWillShutdownView.types';

export const HotelWillShutdownView: FC<HotelWillShutdownViewProps> = props =>
{
    const { notification = null, inTray = null, onButtonClick = null } = props;
    
    if(!notification) return null;

    const content = <>{ LocalizeText('opening.hours.shutdown', ['m'], [notification.minutes.toString()]) }</>;

    if(inTray)
        return (
            <NotificationTrayItemView title={ LocalizeText('mod.alert.title') } content={ content } timestamp={ notification.timestamp } onCloseClick={ () => onButtonClick('remove_notification') } />
        );

    return (
        <NitroCardView className="nitro-notification">
            <NitroCardSimpleHeaderView headerText={ LocalizeText('mod.alert.title') } onCloseClick={ () => onButtonClick('dismiss_notification') } />
            <NitroCardContentView className="text-black">
                { content }
            </NitroCardContentView>
        </NitroCardView>
    );
};
