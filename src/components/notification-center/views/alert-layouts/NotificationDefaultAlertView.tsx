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
    }, [item, close]);
    
    const hasFrank = item.alertType === NotificationAlertType.DEFAULT;

    return (
        <LayoutNotificationAlertView title={title} close={close} {...rest} type={ hasFrank ? NotificationAlertType.DEFAULT : item.alertType }>
            <Flex fullHeight overflow="auto" gap={ hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0 }>
            {hasFrank && !item.imageUrl && <Base className="notification-frank flex-shrink-0" /> }
            {item.imageUrl && !imageFailed && <img src={item.imageUrl} alt={item.title} onError={() => { setImageFailed(true) }} className="align-self-baseline" />}
            <Base classNames={['notification-text overflow-y-auto d-flex flex-column w-100', (item.clickUrl && !hasFrank) ? 'justify-content-center' : '']}>
                { (item.messages.length > 0) && item.messages.map((message, index) =>
                {
                    const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                    return <Base key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                })}
                    {item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                        <hr className="my-2 w-100" />
                        <Button onClick={visitUrl} className="align-self-center px-3">{LocalizeText(item.clickUrlText)}</Button>
                    </>}
            </Base>
            </Flex>
            { (!item.imageUrl || (item.imageUrl && imageFailed)) && <>
                <Column alignItems="center" center gap={0}>
                    <hr className="my-2 w-100" />
                    { !item.clickUrl &&
                        <Button onClick={close}>{LocalizeText('generic.close')}</Button>}
                    { item.clickUrl && (item.clickUrl.length > 0) && <Button onClick={visitUrl}>{LocalizeText(item.clickUrlText)}</Button> }
                </Column>
            </> }
        </LayoutNotificationAlertView>
    );

}
