import { DetailsHTMLAttributes, FC } from 'react';
import { LayoutNotificationBubbleView } from '../../../../common';
import { NotificationBubbleLayoutViewProps } from './NotificationBubbleLayoutView.types';

interface NotificationDefaultBubbleViewProps extends NotificationBubbleLayoutViewProps, DetailsHTMLAttributes<HTMLDivElement>
{

}

export const NotificationDefaultBubbleView: FC<NotificationDefaultBubbleViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    return (
        <LayoutNotificationBubbleView className="d-flex" close={ close } { ...rest }>
            { (item.iconUrl && item.iconUrl.length) && <img className="bubble-image no-select" src={ item.iconUrl } alt="" /> }
            <span>{ item.message }</span>
        </LayoutNotificationBubbleView>
    );
}
