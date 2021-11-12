import { ChatRecordData, GetRoomChatlogMessageComposer, RoomChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ChatlogView } from '../../chatlog/ChatlogView';
import { ModToolsChatlogViewProps } from './ModToolsChatlogView.types';

export const ModToolsChatlogView: FC<ModToolsChatlogViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;

    const [roomChatlog, setRoomChatlog] = useState<ChatRecordData>(null);

    useEffect(() =>
    {
        SendMessageHook(new GetRoomChatlogMessageComposer(roomId));
    }, [roomId]);

    const onModtoolRoomChatlogEvent = useCallback((event: RoomChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.roomId !== roomId) return;

        setRoomChatlog(parser.data);
    }, [roomId, setRoomChatlog]);

    CreateMessageHook(RoomChatlogEvent, onModtoolRoomChatlogEvent);

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
