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
        <NotificationBubbleView fadesOut={ false } className="flex-column club-gift" close={ close } { ...rest }>
            <div className="d-flex align-items-center gap-2 mb-2">
                <CurrencyIcon type="hc" className="flex-shrink-0" />
                <span className="ms-1">{ LocalizeText('notifications.text.club_gift') }</span>
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2">
                <button type="button" className="btn btn-success w-100 btn-sm" onClick={ () => NotificationUtilities.openUrl(item.linkUrl) }>{ LocalizeText('notifications.button.show_gift_list') }</button>
                <span className="text-decoration-underline cursor-pointer text-nowrap" onClick={ close }>{ LocalizeText('notifications.button.later') }</span>
            </div>
        </NotificationBubbleView>
    );
}
