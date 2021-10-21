import { ChatRecordData, GetUserChatlogMessageComposer, UserChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ChatlogView } from '../../chatlog/ChatlogView';
import { ModToolsUserChatlogViewProps } from './ModToolsUserChatlogView.types';

export const ModToolsUserChatlogView: FC<ModToolsUserChatlogViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [userChatlog, setUserChatlog] = useState<ChatRecordData[]>(null);
    const [username, setUsername] = useState<string>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetUserChatlogMessageComposer(userId));
    }, [userId]);
    
    const onModtoolUserChatlogEvent = useCallback((event: UserChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setUsername(parser.data.username);
        setUserChatlog(parser.data.roomChatlogs);
    }, [setUsername, setUserChatlog, userId]);

    CreateMessageHook(UserChatlogEvent, onModtoolUserChatlogEvent);

    return (
        <NitroCardView className="nitro-mod-tools-user-chatlog" simple={true}>
            <NitroCardHeaderView headerText={'User Chatlog' + (username ? ': ' + username : '')} onCloseClick={() => onCloseClick()} />
            <NitroCardContentView className="text-black h-100">
                {userChatlog &&
                    <ChatlogView records={userChatlog} />
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
