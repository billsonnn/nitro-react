import { CallForHelpMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../api';
import { HelpEvent } from '../../../events/help/HelpEvent';
import { dispatchUiEvent, SendMessageHook } from '../../../hooks';
import { useHelpContext } from '../context/HelpContext';

export const DescribeReportView: FC<{}> = props =>
{
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const [message, setMessage] = useState('');

    const submitReport = useCallback(() =>
    {
        if(message.length < 15) return;
        
        const reportState = Object.assign({}, helpReportState);

        reportState.message = message;

        setHelpReportState(reportState);

        const roomId = reportState.reportedChats[0].roomId;
        const chats: (string | number )[] = []; 
        reportState.reportedChats.forEach(entry =>
        {
            chats.push(entry.entityId);
            chats.push(entry.message);
        });

        SendMessageHook(new CallForHelpMessageComposer(message, reportState.cfhTopic, reportState.reportedUserId, roomId, chats));

        dispatchUiEvent(new HelpEvent(HelpEvent.HIDE_HELP_CENTER));
    }, [helpReportState, message, setHelpReportState]);

    return (
        <div className="d-flex flex-column gap-2 h-100">
            <h3 className="text-center m-0">{LocalizeText('help.emergency.chat_report.subtitle')}</h3>
            <div className="text-wrap">{LocalizeText('help.cfh.input.text')}</div>
            <div className="form-group mb-2">
                <textarea className="form-control" value={message} onChange={event => setMessage(event.target.value)} />
            </div>

            <button className="btn btn-danger" disabled={message.length < 15} onClick={submitReport}>{LocalizeText('help.bully.submit')}</button>
        </div>
    );
}
