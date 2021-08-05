import { FC } from 'react';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NotificationCenterAlertBaseProps } from './NotificationCenterAlertBase.types';


export const NotificationCenterAlertBase: FC<NotificationCenterAlertBaseProps> = props =>
{
    const { headerText = LocalizeText('mod.alert.title'), onClose = null, children = null } = props;

    return (
        <NitroCardView className="nitro-alert" simple={ true }>
            <NitroCardHeaderView headerText={ headerText } onCloseClick={ onClose } />
            <NitroCardContentView className="d-flex flex-column justify-content-between text-black">
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
