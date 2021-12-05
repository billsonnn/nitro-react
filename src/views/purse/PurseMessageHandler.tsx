import { ActivityPointNotificationMessageEvent, UserCreditsEvent, UserCurrencyEvent, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CREDITS, DUCKETS, PlaySound } from '../../api/utils/PlaySound';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { usePurseContext } from './context/PurseContext';
import { PurseMessageHandlerProps } from './PurseMessageHandler.types';
 
export const PurseMessageHandler: FC<PurseMessageHandlerProps> = props =>
{
    const { purse = null } = usePurseContext();

    const onUserCreditsEvent = useCallback((event: UserCreditsEvent) =>
    {
        const parser = event.getParser();

        if(purse.credits && purse.credits !== parseFloat(parser.credits)) PlaySound(CREDITS);

        purse.credits = parseFloat(parser.credits);

        purse.notify();
    }, [ purse ]);

    const onUserCurrencyEvent = useCallback((event: UserCurrencyEvent) =>
    {
        const parser = event.getParser();

        purse.activityPoints = parser.currencies;

        purse.notify();
    }, [ purse ]);

    const onUserCurrencyUpdateEvent = useCallback((event: ActivityPointNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        purse.activityPoints.set(parser.type, parser.amount);

        if(parser.type === 0) PlaySound(DUCKETS);

        purse.notify();
    }, [ purse ]);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
    {
        const parser = event.getParser();

        const productName = parser.productName;

        if((productName !== 'club_habbo') && (productName !== 'habbo_club')) return;

        purse.clubDays = Math.max(0, parser.daysToPeriodEnd);
        purse.clubPeriods = Math.max(0, parser.periodsSubscribedAhead);
        purse.isVip = parser.isVip;
        purse.pastClubDays = parser.pastClubDays;
        purse.pastVipDays = parser.pastVipDays;
        purse.isExpiring = ((parser.responseType === UserSubscriptionParser.RESPONSE_TYPE_DISCOUNT_AVAILABLE) ? true : false);
        purse.minutesUntilExpiration = parser.minutesUntilExpiration;
        purse.minutesSinceLastModified = parser.minutesSinceLastModified;

        purse.notify();
    }, [ purse ]);

    CreateMessageHook(UserCreditsEvent, onUserCreditsEvent);
    CreateMessageHook(UserCurrencyEvent, onUserCurrencyEvent);
    CreateMessageHook(ActivityPointNotificationMessageEvent, onUserCurrencyUpdateEvent);
    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);

    return null;
}
