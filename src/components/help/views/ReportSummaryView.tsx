import { CallForHelpFromForumMessageMessageComposer, CallForHelpFromForumThreadMessageComposer, CallForHelpFromIMMessageComposer, CallForHelpFromPhotoMessageComposer, CallForHelpMessageComposer, GuideSessionReportMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetSessionDataManager, LocalizeText, ReportType, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { useHelp } from '../../../hooks';

export const ReportSummaryView: FC<{}> = props =>
{
    const { activeReport = null, setActiveReport = null } = useHelp();

    const submitReport = () =>
    {
        const chats: (string | number )[] = [];

        switch(activeReport.reportType)
        {
            case ReportType.BULLY:
            case ReportType.EMERGENCY:
            case ReportType.ROOM: {
                const reportedRoomId = ((activeReport.roomId <= 0) ? activeReport.reportedChats[0].roomId : activeReport.roomId);

                activeReport.reportedChats.forEach(entry => chats.push(entry.webId, entry.message));

                SendMessageComposer(new CallForHelpMessageComposer(activeReport.message, activeReport.cfhTopic, activeReport.reportedUserId, reportedRoomId, chats));
                break;
            }
            case ReportType.IM:
                activeReport.reportedChats.forEach(entry => chats.push(entry.webId, entry.message));

                SendMessageComposer(new CallForHelpFromIMMessageComposer(activeReport.message, activeReport.cfhTopic, activeReport.reportedUserId, chats));
                break;
            case ReportType.THREAD:
                SendMessageComposer(new CallForHelpFromForumThreadMessageComposer(activeReport.groupId, activeReport.threadId, activeReport.cfhTopic, activeReport.message));
                break;
            case ReportType.MESSAGE:
                SendMessageComposer(new CallForHelpFromForumMessageMessageComposer(activeReport.groupId, activeReport.threadId, activeReport.messageId, activeReport.cfhTopic, activeReport.message));
                break;
            case ReportType.PHOTO:
                SendMessageComposer(new CallForHelpFromPhotoMessageComposer(activeReport.extraData, activeReport.cfhTopic, activeReport.roomId, GetSessionDataManager().userId, activeReport.roomObjectId));
                break;
            case ReportType.GUIDE:
                SendMessageComposer(new GuideSessionReportMessageComposer(''));
                break;
        }

        setActiveReport(null);
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 4 }>{ LocalizeText('help.cfh.button.send') }</Text>
                <Text>{ LocalizeText('help.main.summary') }</Text>
            </Column>
            <Button variant="success" onClick={ submitReport }>
                { LocalizeText('guide.help.request.emergency.submit.button') }
            </Button>
        </>
    )
}
