import { FC, useCallback } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationUtilities } from '../../../../api';
import { Base, Button, Column, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), close = null, ...rest } = props;

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        
        close();
    }, [ item, close ]);

    const isAction = (item.clickUrl && item.clickUrl.startsWith('event:'));

    return (
        <LayoutNotificationAlertView title={ title } close={ close } { ...rest }>
            { (item.messages.length > 0) && item.messages.map((message, index) =>
                {
                    const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                    return <Base grow fullHeight overflow="auto" key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                }) }
            <Column alignItems="center" center gap={ 1 }>
                { !isAction &&
                    <Button onClick={ close }>{ LocalizeText('generic.close') }</Button> }
                { !isAction && item.clickUrl && (item.clickUrl.length > 0) &&
                    <Button variant="link" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
                { isAction && item.clickUrl && (item.clickUrl.length > 0) &&
                    <Button onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
            </Column>
        </LayoutNotificationAlertView>
    );
}
