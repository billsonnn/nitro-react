import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../api';
import { NotificationAlertView } from '../../../../../layout';
import { NotificationUtilities } from '../../../common/NotificationUtilities';
import { NotificationEventAlertViewProps } from './NotificationEventAlertView.types';

export const NotificationEventAlertView: FC<NotificationEventAlertViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        
        close();
    }, [ item, close ]);

    return (
        <NotificationAlertView title={ item.title } close={ close } { ...rest }>
            { (item.messages.length > 0) && item.messages.map((message, index) =>
                {
                    const htmlText = message.replace(/\r\n|\r|\n/g, '<br />');

                    return (
                        <div key={ index } dangerouslySetInnerHTML={ { __html: htmlText } } />
                    );
                }) }
            <div className="d-flex justify-content-center align-items-center mt-1">
                <button type="button" className="btn btn-primary" onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</button>
            </div>
        </NotificationAlertView>
    );
}
