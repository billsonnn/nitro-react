import { DetailsHTMLAttributes, FC } from 'react';
import { Flex, LayoutNotificationBubbleView, Text } from '../../../../common';
import { NotificationBubbleLayoutViewProps } from './NotificationBubbleLayoutView.types';

interface NotificationDefaultBubbleViewProps extends NotificationBubbleLayoutViewProps, DetailsHTMLAttributes<HTMLDivElement>
{

}

export const NotificationDefaultBubbleView: FC<NotificationDefaultBubbleViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    return (
        <LayoutNotificationBubbleView close={ close } gap={ 2 } alignItems="center" { ...rest }>
            <Flex center className="bubble-image-container">
                { (item.iconUrl && item.iconUrl.length) &&
                    <img className="no-select" src={ item.iconUrl } alt="" /> }
            </Flex>
            <Text wrap variant="white">{ item.message }</Text>
        </LayoutNotificationBubbleView>
    );
}
