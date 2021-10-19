import { ChatRecordData, ModtoolRequestUserChatlogComposer, ModtoolUserChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ChatlogView } from '../chatlog/ChatlogView';
import { ModToolsUserChatlogViewProps } from './ModToolsUserChatlogView.types';

export const ModToolsUserChatlogView: FC<ModToolsUserChatlogViewProps> = props =>
{
    const { userId = null, onCloseClick = null } = props;
    const [userChatlog, setUserChatlog] = useState<ChatRecordData[]>(null);
    const [username, setUsername] = useState<string>(null);

    useEffect(() =>
    {
        SendMessageHook(new ModtoolRequestUserChatlogComposer(userId));
    }, [userId]);
    
    const onModtoolUserChatlogEvent = useCallback((event: ModtoolUserChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.userId !== userId) return;

        setUsername(parser.username);
        setUserChatlog(parser.roomVisits);
    }, [setUsername, setUserChatlog, userId]);

    CreateMessageHook(ModtoolUserChatlogEvent, onModtoolUserChatlogEvent);

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
