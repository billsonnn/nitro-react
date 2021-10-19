import { ChatRecordData, ModtoolRequestRoomChatlogComposer, ModtoolRoomChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ChatlogView } from '../chatlog/ChatlogView';
import { ModToolsChatlogViewProps } from './ModToolsChatlogView.types';

export const ModToolsChatlogView: FC<ModToolsChatlogViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;

    const [roomChatlog, setRoomChatlog] = useState<ChatRecordData>(null);

    useEffect(() =>
    {
        SendMessageHook(new ModtoolRequestRoomChatlogComposer(roomId));
    }, [roomId]);

    const onModtoolRoomChatlogEvent = useCallback((event: ModtoolRoomChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setRoomChatlog(parser.data);
    }, [setRoomChatlog]);

    CreateMessageHook(ModtoolRoomChatlogEvent, onModtoolRoomChatlogEvent);

    return (
        <NitroCardView className="nitro-mod-tools-room-chatlog" simple={true}>
            <NitroCardHeaderView headerText={'Room Chatlog' + (roomChatlog ? ': ' + roomChatlog.roomName : '')} onCloseClick={() => onCloseClick()} />
            <NitroCardContentView className="text-black h-100">
                {roomChatlog &&
                    <ChatlogView records={[roomChatlog]} />
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
