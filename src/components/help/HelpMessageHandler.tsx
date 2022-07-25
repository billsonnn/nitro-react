import { CallForHelpResultMessageEvent, GetPendingCallsForHelpMessageComposer, IssueCloseNotificationMessageEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CallForHelpResult, GetCloseReasonKey, LocalizeText, NotificationAlertType, SendMessageComposer } from '../../api';
import { useMessageEvent, useNotification } from '../../hooks';
 
export const HelpMessageHandler: FC<{}> = props =>
{
    const { simpleAlert = null } = useNotification();

    useMessageEvent<CallForHelpResultMessageEvent>(CallForHelpResultMessageEvent, event =>
    {
        const parser = event.getParser();

        let message = parser.messageText;

        switch(parser.resultType)
        {
            case CallForHelpResult.TOO_MANY_PENDING_CALLS_CODE:
                SendMessageComposer(new GetPendingCallsForHelpMessageComposer());
                simpleAlert(LocalizeText('help.cfh.error.pending'), NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.error.title'));
                break;
            case CallForHelpResult.HAS_ABUSIVE_CALL_CODE:
                simpleAlert(LocalizeText('help.cfh.error.abusive'), NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.error.title'));
                break;
            default:
                if(message.trim().length === 0)
                {
                    message = LocalizeText('help.cfh.sent.text');
                }

                simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.sent.title'));
        }
    });

    useMessageEvent<IssueCloseNotificationMessageEvent>(IssueCloseNotificationMessageEvent, event =>
    {
        const parser = event.getParser();

        const message = parser.messageText.length === 0 ? LocalizeText('help.cfh.closed.' + GetCloseReasonKey(parser.closeReason)) : parser.messageText;

        simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('mod.alert.title'));
    });

    return null;
}
