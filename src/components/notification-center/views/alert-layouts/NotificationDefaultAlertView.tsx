import { FC, useCallback, useState } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationAlertType, NotificationUtilities } from '../../../../api';
import { Base, Button, Column, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), close = null, ...rest } = props;

    const [imageFailed, setImageFailed] = useState<boolean>(false)

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        
        close();
    }, [ item, close ]);
    

    const isAction = (item.clickUrl && item.clickUrl.startsWith('event:'));

    const hasFrank = item.alertType === NotificationAlertType.DEFAULT || item.alertType === NotificationAlertType.MODERATION;

    return (
        <LayoutNotificationAlertView title={title} close={close} {...rest}>
            <Flex fullHeight overflow="auto" gap={2}>
                {hasFrank && !item.imageUrl && <Base className="notification-frank flex-shrink-0" /> }
                {item.imageUrl && !imageFailed && <img src={item.imageUrl} alt={ item.title } onError={() => { setImageFailed(true) } } /> }
                { (item.messages.length > 0) && item.messages.map((message, index) =>
                {
                    const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                    return <Base grow fullHeight overflow="auto" key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                })}
            </Flex>
            <hr className="my-2"/>
            <Column alignItems="center" center gap={ 1 }>
                { !isAction && !item.clickUrl &&
                    <Button onClick={ close }>{ LocalizeText('generic.close') }</Button> }
                { item.clickUrl && (item.clickUrl.length > 0) &&
                    <Button onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
            </Column>
        </LayoutNotificationAlertView>
    );
}
