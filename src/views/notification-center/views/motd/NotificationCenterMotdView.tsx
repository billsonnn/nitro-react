import { FC } from 'react';
import { NotificationCenterBroadcastMessageView } from '../broadcast-message/NotificationCenterBroadcastMessageView';
import { NotificationCenterMotdViewProps } from './NotificationCenterMotdView.types';

export const NotificationCenterMotdView: FC<NotificationCenterMotdViewProps> = props =>
{
    const { notification = null, onClose = null } = props;

    return <NotificationCenterBroadcastMessageView notification={ notification } onClose={ onClose } />;
}
