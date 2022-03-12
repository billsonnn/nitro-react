import { FC } from 'react';
import { NotificationBubbleItem } from '../../../../api';
import { Flex, LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps, Text } from '../../../../common';

export interface NotificationDefaultBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
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
