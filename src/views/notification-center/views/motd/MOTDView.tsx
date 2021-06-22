import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NotificationTrayItemView } from '../tray-item/NotificationTrayItemView';
import { MOTDViewProps } from './MOTDView.types';

export const MOTDView: FC<MOTDViewProps> = props =>
{
    const { notification = null, inTray = null, onButtonClick = null } = props;
    
    if(!notification) return null;

    const content = notification.messages.map((message, index) =>
    {
        return <div key={ index } dangerouslySetInnerHTML={ {__html: message } } />
    });

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
