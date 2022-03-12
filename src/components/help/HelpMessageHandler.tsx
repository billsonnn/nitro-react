import { CallForHelpResultMessageEvent, GetPendingCallsForHelpMessageComposer, IssueCloseNotificationMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, NotificationAlertType, NotificationUtilities, SendMessageComposer } from '../../api';
import { UseMessageEventHook } from '../../hooks';
import { CallForHelpResult } from './common/CallForHelpResult';
import { GetCloseReasonKey } from './common/GetCloseReasonKey';
 
export const HelpMessageHandler: FC<{}> = props =>
{
    const onCallForHelpResultMessageEvent = useCallback((event: CallForHelpResultMessageEvent) =>
    {
        const parser = event.getParser();

        let message = parser.messageText;

        switch(parser.resultType)
        {
            case CallForHelpResult.TOO_MANY_PENDING_CALLS_CODE:
                SendMessageComposer(new GetPendingCallsForHelpMessageComposer());
                NotificationUtilities.simpleAlert(LocalizeText('help.cfh.error.pending'), NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.error.title'));
                break;
            case CallForHelpResult.HAS_ABUSIVE_CALL_CODE:
                NotificationUtilities.simpleAlert(LocalizeText('help.cfh.error.abusive'), NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.error.title'));
                break;
            default:
                if(message.trim().length === 0)
                {
                    message = LocalizeText('help.cfh.sent.text');
                }
                NotificationUtilities.simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.sent.title'));
        }
    }, []);

    UseMessageEventHook(CallForHelpResultMessageEvent, onCallForHelpResultMessageEvent);

    const onIssueCloseNotificationMessageEvent = useCallback((event: IssueCloseNotificationMessageEvent) =>
    {
        const parser = event.getParser();

        const message = parser.messageText.length === 0 ? LocalizeText('help.cfh.closed.' + GetCloseReasonKey(parser.closeReason)) : parser.messageText;

        NotificationUtilities.simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('mod.alert.title'));
    }, []);

    UseMessageEventHook(IssueCloseNotificationMessageEvent, onIssueCloseNotificationMessageEvent);

    return null;
}
