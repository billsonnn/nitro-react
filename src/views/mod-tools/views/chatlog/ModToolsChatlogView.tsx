import { ModtoolRequestRoomChatlogComposer, ModtoolRoomChatlogEvent, ModtoolRoomChatlogLine } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { TryVisitRoom } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ModToolsChatlogViewProps } from './ModToolsChatlogView.types';

export const ModToolsChatlogView: FC<ModToolsChatlogViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;

    const [ roomName, setRoomName ] = useState(null);
    const [ messages, setMessages ] = useState<ModtoolRoomChatlogLine[]>(null);
    const [ loadedRoomId, setLoadedRoomId ] = useState(null);

    const [ messagesRequested, setMessagesRequested ] = useState(false);

    useEffect(() =>
    {
        if(messagesRequested) return;

        SendMessageHook(new ModtoolRequestRoomChatlogComposer(roomId));
        setMessagesRequested(true);
    }, [ roomId, messagesRequested, setMessagesRequested ]);

    const onModtoolRoomChatlogEvent = useCallback((event: ModtoolRoomChatlogEvent) =>
    {
        const parser = event.getParser();

        setRoomName(parser.data.roomName);
        setMessages(parser.data.chatlog);
        setLoadedRoomId(parser.data.roomId);
    }, [ setRoomName, setMessages ]);

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
                TryVisitRoom(loadedRoomId);
                return;
        }
    }, [ onCloseClick, loadedRoomId ]);

    return (
        <NitroCardView className="nitro-mod-tools-chatlog" simple={ true }>
            <NitroCardHeaderView headerText={ 'Room Chatlog' + (roomName ? ': ' + roomName : '') } onCloseClick={ event => handleClick('close') } />
            <NitroCardContentView className="text-black h-100">
                <div className="w-100 d-flex justify-content-end">
                    <button className="btn btn-sm btn-primary me-2" onClick={ event => handleClick('visit_room') }>Visit Room</button>
                    <button className="btn btn-sm btn-primary">Room Tools</button>
                </div>
                <div className="chatlog-messages overflow-auto">
                    { messages && <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">Time</th>
                                <th className="text-center">User</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            { messages.map((message, index) =>
                                {
                                    return <tr key={ index }>
                                        <td className="text-center">{ message.timestamp }</td>
                                        <td className="text-center"><a href="#" className="fw-bold">{ message.userName }</a></td>
                                        <td className="word-break">{ message.message }</td>
                                    </tr>;
                                }) }
                        </tbody>
                    </table> }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
