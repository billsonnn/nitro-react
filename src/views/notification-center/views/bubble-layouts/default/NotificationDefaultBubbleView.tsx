import { FC } from 'react';
import { NotificationBubbleView } from '../../../../../layout';
import { NotificationDefaultBubbleViewProps } from './NotificationDefaultBubbleView.types';

export const NotificationDefaultBubbleView: FC<NotificationDefaultBubbleViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    return (
        <NotificationBubbleView className="d-flex" close={ close } { ...rest }>
            { (item.iconUrl && item.iconUrl.length) && <img className="bubble-image no-select" src={ item.iconUrl } alt="" /> }
            <span>{ item.message }</span>
        </NotificationBubbleView>
    );
}
