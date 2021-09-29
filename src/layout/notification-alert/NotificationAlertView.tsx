import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../card';
import { NotificationAlertViewProps } from './NotificationAlertView.types';

export const NotificationAlertView: FC<NotificationAlertViewProps> = props =>
{
    const { title = '', close = null, className = '', children = null, ...rest } = props;

    return (
        <NitroCardView className={ 'nitro-alert ' + className } simple={ true } { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ close } />
            <NitroCardContentView className="d-flex flex-column justify-content-between text-black">
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
