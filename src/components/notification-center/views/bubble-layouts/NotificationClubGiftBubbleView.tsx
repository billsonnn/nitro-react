import { FC } from 'react';
import { LocalizeText, NotificationBubbleItem, OpenUrl } from '../../../../api';
import { LayoutCurrencyIcon, LayoutNotificationBubbleView, LayoutNotificationBubbleViewProps } from '../../../../common';

export interface NotificationClubGiftBubbleViewProps extends LayoutNotificationBubbleViewProps
{
    item: NotificationBubbleItem;
}

export const NotificationClubGiftBubbleView: FC<NotificationClubGiftBubbleViewProps> = props =>
{
    const { item = null, onClose = null, ...rest } = props;

    return (
        <LayoutNotificationBubbleView className="flex-col club-gift" fadesOut={ false } onClose={ onClose } { ...rest }>
            <div className="flex items-center gap-2 mb-2">
                <LayoutCurrencyIcon className="flex-shrink-0" type="hc" />
                <span className="ms-1">{ LocalizeText('notifications.text.club_gift') }</span>
            </div>
            <div className="flex items-center justify-end gap-2">
                <button className="btn btn-success w-full btn-sm" type="button" onClick={ () => OpenUrl(item.linkUrl) }>{ LocalizeText('notifications.button.show_gift_list') }</button>
                <span className="underline cursor-pointer text-nowrap" onClick={ onClose }>{ LocalizeText('notifications.button.later') }</span>
            </div>
        </LayoutNotificationBubbleView>
    );
};
