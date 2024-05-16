import { FC, useState } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationAlertType, OpenUrl } from '../../../../api';
import { Button, Column, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), onClose = null, ...rest } = props;
    const [imageFailed, setImageFailed] = useState<boolean>(false)

    const visitUrl = () =>
    {
        OpenUrl(item.clickUrl);

        onClose();
    }

    const hasFrank = (item.alertType === NotificationAlertType.DEFAULT);

    return (
        <LayoutNotificationAlertView title={title} onClose={onClose} {...rest} type={hasFrank ? NotificationAlertType.DEFAULT : item.alertType}>
            <Flex fullHeight gap={hasFrank || (item.imageUrl && !imageFailed) ? 2 : 0} overflow="auto">
                {hasFrank && !item.imageUrl && <div className="notification-frank flex-shrink-0" />}
                {item.imageUrl && !imageFailed && <img alt={item.title} className="align-self-baseline" src={item.imageUrl} onError={() => 
                {
                    setImageFailed(true)
                }} />}
                <div className={['notification-text overflow-y-auto flex flex-col w-full', (item.clickUrl && !hasFrank) ? 'justify-center' : ''].join(' ')}>
                    {(item.messages.length > 0) && item.messages.map((message, index) =>
                    {
                        const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                        return <div key={index} dangerouslySetInnerHTML={{ __html: htmlText }} />;
                    })}
                    {item.clickUrl && (item.clickUrl.length > 0) && (item.imageUrl && !imageFailed) && <>
                        <hr className="my-2 w-full" />
                        <Button className="align-self-center px-3" onClick={visitUrl}>{LocalizeText(item.clickUrlText)}</Button>
                    </>}
                </div>
            </Flex>
            {(!item.imageUrl || (item.imageUrl && imageFailed)) && <>
                <Column center alignItems="center" gap={0}>
                    <hr className="my-2 w-full" />
                    {!item.clickUrl &&
                        <Button onClick={onClose}>{LocalizeText('generic.close')}</Button>}
                    {item.clickUrl && (item.clickUrl.length > 0) && <Button onClick={visitUrl}>{LocalizeText(item.clickUrlText)}</Button>}
                </Column>
            </>}
        </LayoutNotificationAlertView>
    );

}
