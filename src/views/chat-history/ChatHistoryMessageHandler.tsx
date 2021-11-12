import { GetGuestRoomResultEvent, RoomSessionChatEvent, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomSession } from '../../api';
import { CreateMessageHook, useRoomSessionManagerEvent } from '../../hooks';
import { useChatHistoryContext } from './context/ChatHistoryContext';
import { ChatEntryType, CHAT_HISTORY_MAX, IChatEntry, IRoomHistoryEntry, ROOM_HISTORY_MAX } from './context/ChatHistoryContext.types';
import { currentDate } from './utils/Utilities';

export const ChatHistoryMessageHandler: FC<{}> = props =>
{
    const { chatHistoryState = null, roomHistoryState = null } = useChatHistoryContext();

    const [needsRoomInsert, setNeedsRoomInsert ] = useState(false);

    const addChatEntry = useCallback((entry: IChatEntry) =>
    {
        entry.id = chatHistoryState.chats.length;
        
        chatHistoryState.chats.push(entry);

        //check for overflow
        if(chatHistoryState.chats.length > CHAT_HISTORY_MAX)
        {
            chatHistoryState.chats.shift();
        }
        chatHistoryState.notify();
       
        //dispatchUiEvent(new ChatHistoryEvent(ChatHistoryEvent.CHAT_HISTORY_CHANGED));
        
    }, [chatHistoryState]);

    const addRoomHistoryEntry = useCallback((entry: IRoomHistoryEntry) =>
    {
        roomHistoryState.roomHistory.push(entry);

        // check for overflow
        if(roomHistoryState.roomHistory.length > ROOM_HISTORY_MAX)
        {
            roomHistoryState.roomHistory.shift();
        }

        roomHistoryState.notify();
    }, [roomHistoryState]);

    const onChatEvent = useCallback((event: RoomSessionChatEvent) =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData) return;
         
        const timeString = currentDate();

        const entry: IChatEntry = { id: -1, entityId: userData.webID, name: userData.name, look: userData.figure, entityType: userData.type, message: event.message, timestamp: timeString, type: ChatEntryType.TYPE_CHAT, roomId: roomSession.roomId };

        addChatEntry(entry);
    }, [addChatEntry]);
    
    useRoomSessionManagerEvent(RoomSessionChatEvent.CHAT_EVENT, onChatEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                setNeedsRoomInsert(true);
                break;
            case RoomSessionEvent.ENDED:
                //dispatchUiEvent(new ChatHistoryEvent(ChatHistoryEvent.HIDE_CHAT_HISTORY));
                break;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.STARTED, onRoomSessionEvent);

    const onGetGuestRoomResultEvent = useCallback((event: GetGuestRoomResultEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const session = GetRoomSession();

        if(!session || (session.roomId !== parser.data.roomId)) return;

        if(needsRoomInsert)
        {
            const chatEntry: IChatEntry = { id: -1, entityId: parser.data.roomId, name: parser.data.roomName, timestamp: currentDate(), type: ChatEntryType.TYPE_ROOM_INFO, roomId: parser.data.roomId };

            addChatEntry(chatEntry);

            const roomEntry: IRoomHistoryEntry = { id: parser.data.roomId, name: parser.data.roomName };

            addRoomHistoryEntry(roomEntry);

            setNeedsRoomInsert(false);
        }
    }, [addChatEntry, addRoomHistoryEntry, needsRoomInsert]);

    CreateMessageHook(GetGuestRoomResultEvent, onGetGuestRoomResultEvent);
    
    return null;
}
