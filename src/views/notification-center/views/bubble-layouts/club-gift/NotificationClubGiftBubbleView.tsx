import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { NotificationBubbleView } from '../../../../../layout';
import { CurrencyIcon } from '../../../../shared/currency-icon/CurrencyIcon';
import { NotificationUtilities } from '../../../common/NotificationUtilities';
import { NotificationBubbleLayoutViewProps } from '../NotificationBubbleLayoutView.types';

export const NotificationClubGiftBubbleView: FC<NotificationBubbleLayoutViewProps> = props =>
{
    const { item = null, close = null, ...rest } = props;

    return (
        <NotificationBubbleView className="flex-column club-gift" close={ close } { ...rest }>
            <div className="d-flex mb-1">
                <CurrencyIcon type="hc" />
                <span className="ms-1">{ LocalizeText('notifications.text.club_gift') }</span>
            </div>
            <div className="d-flex align-items-center justify-content-end">
                <span className="fw-bold me-1" onClick={ close }>{ LocalizeText('notifications.button.later') }</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={ () => NotificationUtilities.openUrl(item.linkUrl) }>{ LocalizeText('notifications.button.show_gift_list') }</button>
            </div>
        </NotificationBubbleView>
    );
}
