import { CallForHelpMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { useHelpContext } from '../HelpContext';

export const DescribeReportView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const { reportedChats, cfhTopic, reportedUserId } = helpReportState;

    const submitReport = () =>
    {
        if(message.length < 15) return;

        const roomId = reportedChats[0].roomId;
        const chats: (string | number )[] = [];

        reportedChats.forEach(entry =>
        {
            chats.push(entry.entityId);
            chats.push(entry.message);
        });

        SendMessageComposer(new CallForHelpMessageComposer(message, cfhTopic, reportedUserId, roomId, chats));

        CreateLinkEvent('help/hide');
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
                <Text>{ LocalizeText('help.cfh.input.text') }</Text>
            </Column>
            <textarea className="form-control h-100" value={ message } onChange={ event => setMessage(event.target.value) } />
            <Button variant="success" disabled={ (message.length < 15) } onClick={ submitReport }>
                { LocalizeText('help.bully.submit') }
            </Button>
        </>
    );
}
