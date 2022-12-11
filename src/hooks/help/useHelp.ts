import { CallForHelpDisabledNotifyMessageEvent, CallForHelpPendingCallsDeletedMessageEvent, CallForHelpPendingCallsMessageEvent, CallForHelpReplyMessageEvent, CallForHelpResultMessageEvent, DeletePendingCallsForHelpMessageComposer, GetPendingCallsForHelpMessageComposer, IssueCloseNotificationMessageEvent, SanctionStatusEvent, SanctionStatusMessageParser } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { CallForHelpResult, GetCloseReasonKey, IHelpReport, LocalizeText, NotificationAlertType, ReportState, ReportType, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';
import { useNotification } from '../notification';

const useHelpState = () =>
{
    const [ activeReport, setActiveReport ] = useState<IHelpReport>(null);
    const [ sanctionInfo, setSanctionInfo ] = useState<SanctionStatusMessageParser>(null);
    const { simpleAlert = null, showConfirm = null } = useNotification();

    const report = (type: number, options: Partial<IHelpReport>) =>
    {
        const newReport: IHelpReport = {
            reportType: type,
            reportedUserId: -1,
            reportedChats: [],
            cfhCategory: -1,
            cfhTopic: -1,
            roomId: -1,
            roomName: '',
            messageId: -1,
            threadId: -1,
            groupId: -1,
            extraData: '',
            roomObjectId: -1,
            message: '',
            currentStep: 0
        };

        switch(type)
        {
            case ReportType.BULLY:
            case ReportType.EMERGENCY:
            case ReportType.IM:
                newReport.reportedUserId = options.reportedUserId;
                newReport.currentStep = ReportState.SELECT_CHATS;
                break;
            case ReportType.ROOM:
                newReport.roomId = options.roomId;
                newReport.roomName = options.roomName;
                newReport.currentStep = ReportState.SELECT_TOPICS;
                break;
            case ReportType.THREAD:
                newReport.groupId = options.groupId;
                newReport.threadId = options.threadId;
                newReport.currentStep = ReportState.SELECT_TOPICS;
                break;
            case ReportType.MESSAGE:
                newReport.groupId = options.groupId;
                newReport.threadId = options.threadId;
                newReport.messageId = options.messageId;
                newReport.currentStep = ReportState.SELECT_TOPICS;
                break;
            case ReportType.PHOTO:
                newReport.extraData = options.extraData;
                newReport.roomId = options.roomId;
                newReport.reportedUserId = options.reportedUserId;
                newReport.roomObjectId = options.roomObjectId;
                newReport.currentStep = ReportState.SELECT_TOPICS;
                break;
            case ReportType.GUIDE:
                break;
        }

        setActiveReport(newReport);
    }

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

    useMessageEvent<CallForHelpPendingCallsMessageEvent>(CallForHelpPendingCallsMessageEvent, event =>
    {
        const parser = event.getParser();

        if(parser.count > 0)
        {
            showConfirm(LocalizeText('help.emergency.pending.title') + '\n' + parser.pendingCalls[0].message, () =>
            {
                SendMessageComposer(new DeletePendingCallsForHelpMessageComposer());
            }, null, LocalizeText('help.emergency.pending.button.discard'), LocalizeText('help.emergency.pending.button.keep'), LocalizeText('help.emergency.pending.message.subtitle'));
        }
    });

    useMessageEvent<CallForHelpPendingCallsDeletedMessageEvent>(CallForHelpPendingCallsDeletedMessageEvent, event =>
    {
        const message = 'Your pending calls were deleted'; // todo: add localization

        simpleAlert(message, NotificationAlertType.MODERATION, null, null, LocalizeText('mod.alert.title'));
    });

    useMessageEvent<CallForHelpReplyMessageEvent>(CallForHelpReplyMessageEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(parser.message, NotificationAlertType.MODERATION, null, null, LocalizeText('help.cfh.reply.title'));
    });

    useMessageEvent<CallForHelpDisabledNotifyMessageEvent>(CallForHelpDisabledNotifyMessageEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(LocalizeText('help.emergency.global_mute.message'), NotificationAlertType.MODERATION, parser.infoUrl, LocalizeText('help.emergency.global_mute.link'), LocalizeText('help.emergency.global_mute.subtitle'))
    });

    useMessageEvent<SanctionStatusEvent>(SanctionStatusEvent, event =>
    {
        const parser = event.getParser();

        setSanctionInfo(parser);
    });

    return { activeReport, setActiveReport, sanctionInfo, setSanctionInfo, report };
}

export const useHelp = () => useBetween(useHelpState);
