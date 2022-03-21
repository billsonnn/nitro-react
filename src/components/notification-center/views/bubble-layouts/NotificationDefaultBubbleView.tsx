import { FC } from 'react';
import { NotificationBubbleItem, NotificationUtilities } from '../../../../api';
import { Flex, LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps, Text } from '../../../../common';

export interface NotificationDefaultBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationDefaultBubbleView: FC<NotificationDefaultBubbleViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;
    
    const htmlText = item.message.replace(/\r\n|\r|\n/g, '<br />');

    return (
        <LayoutNotificationBubbleView close={ close } gap={ 2 } alignItems="center" onClick={ event => (item.linkUrl && item.linkUrl.length && NotificationUtilities.openUrl(item.linkUrl)) } { ...rest }>
            <Flex center className="bubble-image-container">
                { (item.iconUrl && item.iconUrl.length) &&
                    <img className="no-select" src={ item.iconUrl } alt="" /> }
            </Flex>
            <Text wrap variant="white" dangerouslySetInnerHTML={ { __html: htmlText } } />
        </LayoutNotificationBubbleView>
    );
}
