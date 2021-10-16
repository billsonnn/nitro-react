import { ChatRecordData, ModtoolRequestRoomChatlogComposer, ModtoolRoomChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { TryVisitRoom } from '../../../../api';
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

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'close':
                onCloseClick();
                return;
            case 'visit_room':
                TryVisitRoom(roomChatlog.roomId);
                return;
        }
    }, [onCloseClick, roomChatlog]);

    return (
        <NitroCardView className="nitro-mod-tools-room-chatlog" simple={true}>
            <NitroCardHeaderView headerText={'Room Chatlog' + (roomChatlog ? ': ' + roomChatlog.roomName : '')} onCloseClick={event => handleClick('close')} />
            <NitroCardContentView className="text-black h-100">
                {roomChatlog &&
                    <>
                        <div className="w-100 d-flex justify-content-start">
                            <button className="btn btn-sm btn-primary me-2" onClick={event => handleClick('visit_room')}>Visit Room</button>
                            <button className="btn btn-sm btn-primary">Room Tools</button>
                        </div>
                        <ChatlogView record={roomChatlog} />
                    </>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
