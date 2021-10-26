import { CfhChatlogData, CfhChatlogEvent, GetCfhChatlogMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ChatlogView } from '../../chatlog/ChatlogView';
import { CfhChatlogViewProps } from './CfhChatlogView.types';

export const CfhChatlogView: FC<CfhChatlogViewProps> = props =>
{
    const { onCloseClick = null, issueId = null } = props;
    const [ chatlogData, setChatlogData ] = useState<CfhChatlogData>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetCfhChatlogMessageComposer(issueId));
    }, [issueId]);

    const onCfhChatlogEvent = useCallback((event: CfhChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.issueId !== issueId) return;

        setChatlogData(parser.data);
    }, [issueId]);

    CreateMessageHook(CfhChatlogEvent, onCfhChatlogEvent);

    return (
        <NitroCardView className="nitro-mod-tools-cfh-chatlog" simple={true}>
            <NitroCardHeaderView headerText={'Issue Chatlog'} onCloseClick={onCloseClick} />
            <NitroCardContentView className="text-black">
                { chatlogData && <ChatlogView records={[chatlogData.chatRecord]} />}
            </NitroCardContentView>
        </NitroCardView>
    );
}
