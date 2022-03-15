import { ChatRecordData, GetRoomChatlogMessageComposer, RoomChatlogEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { UseMessageEventHook } from '../../../../hooks';
import { ChatlogView } from '../chatlog/ChatlogView';

interface ModToolsChatlogViewProps
{
    roomId: number;
    onCloseClick: () => void;
}

export const ModToolsChatlogView: FC<ModToolsChatlogViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;
    const [ roomChatlog, setRoomChatlog ] = useState<ChatRecordData>(null);

    const onModtoolRoomChatlogEvent = useCallback((event: RoomChatlogEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.roomId !== roomId) return;

        setRoomChatlog(parser.data);
    }, [ roomId ]);

    UseMessageEventHook(RoomChatlogEvent, onModtoolRoomChatlogEvent);

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomChatlogMessageComposer(roomId));
    }, [ roomId ]);

    if(!roomChatlog) return null;

    return (
        <NitroCardView className="nitro-mod-tools-chatlog" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT}>
            <NitroCardHeaderView headerText={ `Room Chatlog ${ roomChatlog.roomName }` } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black h-100">
                { roomChatlog &&
                    <ChatlogView records={ [ roomChatlog ] } /> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
