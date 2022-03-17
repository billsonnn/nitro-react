import { LocalizeText, NotificationUtilities } from '../../../api';
import { TradingNotificationType } from './TradingNotificationType';

export const TradingNotificationMessage = (type: number) =>
{
    switch(type)
    {
        case TradingNotificationType.ALERT_SCAM:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.warning.other_not_offering'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.ALERT_OTHER_CANCELLED:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.info.closed'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.ALERT_ALREADY_OPEN:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.info.already_open'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.ALERT_OTHER_DISABLED:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.warning.others_account_disabled'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.ERROR_WHILE_COMMIT:
            NotificationUtilities.simpleAlert(`${ LocalizeText('inventory.trading.notification.caption') }, ${ LocalizeText('inventory.trading.notification.commiterror.info') }`, null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.YOU_NOT_ALLOWED:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.warning.own_account_disabled'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;

    }
}
