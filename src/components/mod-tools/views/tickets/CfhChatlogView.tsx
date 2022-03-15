import { CfhChatlogData, CfhChatlogEvent, GetCfhChatlogMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { UseMessageEventHook } from '../../../../hooks';
import { ChatlogView } from '../chatlog/ChatlogView';

interface CfhChatlogViewProps
{
    issueId: number;
    onCloseClick(): void;
}

export const CfhChatlogView: FC<CfhChatlogViewProps> = props =>
{
    const { onCloseClick = null, issueId = null } = props;
    const [ chatlogData, setChatlogData ] = useState<CfhChatlogData>(null);

    useEffect(() =>
    {
        SendMessageComposer(new GetCfhChatlogMessageComposer(issueId));
    }, [issueId]);

    const onCfhChatlogEvent = useCallback((event: CfhChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.issueId !== issueId) return;

        setChatlogData(parser.data);
    }, [issueId]);

    UseMessageEventHook(CfhChatlogEvent, onCfhChatlogEvent);

    return (
        <NitroCardView className="nitro-mod-tools-chatlog" theme="primary-slim">
            <NitroCardHeaderView headerText={'Issue Chatlog'} onCloseClick={onCloseClick} />
            <NitroCardContentView className="text-black">
                { chatlogData && <ChatlogView records={[chatlogData.chatRecord]} />}
            </NitroCardContentView>
        </NitroCardView>
    );
}
