import { DetailsHTMLAttributes, FC, useCallback } from 'react';
import { LocalizeText, NotificationUtilities } from '../../../../api';
import { Base, Button, Column, LayoutNotificationAlertView } from '../../../../common';
import { NotificationAlertLayoutViewProps } from './NotificationAlertLayoutView.types';

interface NotificationDefaultAlertViewProps extends NotificationAlertLayoutViewProps, DetailsHTMLAttributes<HTMLDivElement>
{

}

export const NotificationDefaultAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        
        close();
    }, [ item, close ]);

    return (
        <LayoutNotificationAlertView title={ item.title } close={ close } { ...rest }>
            { (item.messages.length > 0) && item.messages.map((message, index) =>
                {
                    const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                    return <Base grow fullHeight overflow="auto" key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />;
                }) }
            <Column alignItems="center" center gap={ 1 }>
                <Button onClick={ close }>{ LocalizeText('generic.close') }</Button>
                { item.clickUrl && item.clickUrl.length &&
                    <Button variant="link" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
            </Column>
        </LayoutNotificationAlertView>
    );
}
