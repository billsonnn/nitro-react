import { CallForHelpResultMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../api';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { NotificationAlertType } from '../notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../notification-center/common/NotificationUtilities';
import { GetCloseReasonKey } from './common/GetCloseReasonKey';
 
export const HelpMessageHandler: FC<{}> = props =>
{
    const onCallForHelpResultMessageEvent = useCallback((event: CallForHelpResultMessageEvent) =>
    {
        const parser = event.getParser();

        let message = parser.messageText;

        if(!message || !message.length) message = LocalizeText('help.cfh.closed.' + GetCloseReasonKey(parser.resultType))

        NotificationUtilities.simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('mod.alert.title'));
    }, []);

    CreateMessageHook(CallForHelpResultMessageEvent, onCallForHelpResultMessageEvent);

    return null;
}
