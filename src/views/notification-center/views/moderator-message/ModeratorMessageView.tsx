import { FC } from 'react';
import { NitroCardContentView, NitroCardView } from '../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NotificationTrayItemView } from '../tray-item/NotificationTrayItemView';
import { ModeratorMessageViewProps } from './ModeratorMessageView.types';

export const ModeratorMessageView: FC<ModeratorMessageViewProps> = props =>
{
    const { notification = null, inTray = null, onButtonClick = null } = props;
    
    if(!notification) return null;

    const content = <>
        <div dangerouslySetInnerHTML={ {__html: notification.message } } />
        <div className="fw-bold text-center">
            <a href={ notification.link } rel="noreferrer" target="_blank" onClick={ () => onButtonClick('dismiss_notification') }>{ LocalizeText('mod.alert.link') }</a>
        </div>
    </>;

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
