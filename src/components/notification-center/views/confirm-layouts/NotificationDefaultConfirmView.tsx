import { FC } from 'react';
import { NotificationConfirmItem } from '../../../../api';
import { LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

export interface NotificationDefaultConfirmViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationConfirmItem;
}

export const NotificationDefaultConfirmView: FC<NotificationDefaultConfirmViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;
    const { message = null, onConfirm = null, onCancel = null, confirmText = null, cancelText = null, title = null  } = item;

    const confirm = () =>
    {
        if(onConfirm) onConfirm();

        close();
    }

    const cancel = () =>
    {
        if(onCancel) onCancel();
        
        close();
    }

    return (
        <LayoutNotificationAlertView title={ title } close={ close } { ...rest }>
            { message }
            <div className="d-flex justify-content-between align-items-center">
            <button type="button" className="btn btn-danger" onClick={ cancel }>{ cancelText }</button>
                <button type="button" className="btn btn-primary" onClick={ confirm }>{ confirmText }</button>
            </div>
        </LayoutNotificationAlertView>
    );
}
