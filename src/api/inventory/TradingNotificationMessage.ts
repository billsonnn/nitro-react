import { LocalizeText, NotificationUtilities } from '..';
import { TradingNotificationType } from './TradingNotificationType';

export const TradingNotificationMessage = (type: number, otherUsername: string = '') =>
{
    switch(type)
    {
        case TradingNotificationType.ALERT_SCAM:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.warning.other_not_offering'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.HOTEL_TRADING_DISABLED:
        case TradingNotificationType.YOU_NOT_ALLOWED:
        case TradingNotificationType.THEY_NOT_ALLOWED:
        case TradingNotificationType.ROOM_DISABLED:
        case TradingNotificationType.YOU_OPEN:
        case TradingNotificationType.THEY_OPEN:
            NotificationUtilities.simpleAlert(LocalizeText(`inventory.trading.openfail.${ type }`, [ 'otherusername' ], [ otherUsername ]), null, null, null, LocalizeText('inventory.trading.openfail.title'));
            return;
        case TradingNotificationType.ERROR_WHILE_COMMIT:
            NotificationUtilities.simpleAlert(`${ LocalizeText('inventory.trading.notification.caption') }, ${ LocalizeText('inventory.trading.notification.commiterror.info') }`, null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
        case TradingNotificationType.THEY_CANCELLED:
            NotificationUtilities.simpleAlert(LocalizeText('inventory.trading.info.closed'), null, null, null, LocalizeText('inventory.trading.notification.title'));
            return;
    }
}
