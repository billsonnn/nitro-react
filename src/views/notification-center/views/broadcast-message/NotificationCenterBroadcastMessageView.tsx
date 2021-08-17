import { FC, useMemo } from 'react';
import { LocalizeText } from '../../../../api';
import { NotificationCenterAlertBase } from '../alert-base/NotificationCenterAlertBase';
import { NotificationCenterBroadcastMessageViewProps } from './NotificationCenterBroadcastMessageView.types';

export const NotificationCenterBroadcastMessageView: FC<NotificationCenterBroadcastMessageViewProps> = props =>
{
    const { notification = null, onClose = null } = props;

    const message = useMemo(() =>
    {
        let finalMessage = '';

        notification.message.forEach(message =>
            {
                finalMessage += message.replace(/\r\n|\r|\n/g, '<br />');
            });

        return finalMessage;
    }, [ notification ]);

    return (
        <NotificationCenterAlertBase onClose={ onClose }>
            <div dangerouslySetInnerHTML={ { __html: message } } />
            <div className="d-flex justify-content-center align-items-center">
                <button type="button" className="btn btn-primary" onClick={ onClose }>{ LocalizeText('generic.close') }</button>
            </div>
        </NotificationCenterAlertBase>
    );
};
