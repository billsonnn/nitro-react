import { ChatRecordData, GetUserChatlogMessageComposer, UserChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';
import { ChatlogView } from '../chatlog/ChatlogView';

interface ModToolsUserChatlogViewProps
{
    userId: number;
    onCloseClick: () => void;
}

export const ModToolsUserChatlogView: FC<ModToolsUserChatlogViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [ userChatlog, setUserChatlog ] = useState<ChatRecordData[]>(null);
    const [ username, setUsername ] = useState<string>(null);

    useMessageEvent<UserChatlogEvent>(UserChatlogEvent, event =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setUsername(parser.data.username);
        setUserChatlog(parser.data.roomChatlogs);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetUserChatlogMessageComposer(userId));
    }, [ userId ]);

    return (
        <NitroCardView className="nitro-mod-tools-chatlog" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ `User Chatlog: ${ username || '' }` } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black h-100">
                { userChatlog &&
                    <ChatlogView records={ userChatlog } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
