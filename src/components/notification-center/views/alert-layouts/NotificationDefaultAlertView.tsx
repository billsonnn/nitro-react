import { FC, useState } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationAlertType, OpenUrl } from '../../../../api';
import { Base, Button, Column, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), onClose = null, ...rest } = props;
    const [ imageFailed, setImageFailed ] = useState<boolean>(false)

    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);
        
        onClose();
    }
    
    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);

    const options = <Column alignItems="center" center gap={ 0 } className="my-1">
        { !item.clickUrl &&
            <Button onClick={ onClose } variant="success">{ LocalizeText('generic.close') }</Button> }
        { item.clickUrl && (item.clickUrl.length > 0) && <Button variant="success" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
    </Column>

    return (
        <LayoutNotificationAlertView title={ title } onClose={ onClose } { ...rest } type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType } options={ options }>
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
                { hasFrank && !item.imageUrl && <Base className="notification-frank flex-shrink-0" /> }
                { item.imageUrl && !imageFailed && <img src={ item.imageUrl } alt={ item.title } onError={ () => 
                {
                    setImageFailed(true) 
                } } className="align-self-baseline" /> }
                <Base classNames={ [ 'notification-text overflow-y-auto d-flex flex-column w-100', (item.clickUrl && !hasFrank) ? 'justify-content-center' : '' ] }>
                    { (item.messages.length > 0) && item.messages.map((message, index) =>
                    {
                        const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                        return <Base key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                    }) }
                </Base>
            </Flex>
        </LayoutNotificationAlertView>
    );

}
