import { RoomInfoEvent, RoomSessionChatEvent, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomSession } from '../../api';
import { ChatHistoryEvent } from '../../events/chat-history/ChatHistoryEvent';
import { CreateMessageHook, dispatchUiEvent, useRoomSessionManagerEvent } from '../../hooks';
import { useChatHistoryContext } from './context/ChatHistoryContext';
import { ChatEntryType, ChatHistoryAction, CHAT_HISTORY_MAX, IChatEntry } from './reducers/ChatHistoryReducer';
import { currentDate } from './utils/Utilities';

export const ChatHistoryMessageHandler: FC<{}> = props =>
{
    const { chatHistoryState = null, dispatchChatHistoryState = null } = useChatHistoryContext();
    const { chats = null, roomHistory = null } = chatHistoryState;

    const [needsRoomInsert, setNeedsRoomInsert ] = useState(false);

    const addChatEntry = useCallback((entry: IChatEntry) =>
    {
        const newChats = [...chats];

        newChats.push(entry);

        //check for overflow
        if(newChats.length > CHAT_HISTORY_MAX)
        {
            newChats.shift();
        }

        dispatchChatHistoryState({
            type: ChatHistoryAction.SET_CHATS,
            payload: {
                chats: newChats
            }
        }); 
       
        dispatchUiEvent(new ChatHistoryEvent(ChatHistoryEvent.CHAT_HISTORY_CHANGED));
        
    }, [chats, dispatchChatHistoryState]);

    const onChatEvent = useCallback((event: RoomSessionChatEvent) =>
    {
        const roomSession = GetRoomSession();

        if(!roomSession) return;

        const userData = roomSession.userDataManager.getUserDataByIndex(event.objectId);

        if(!userData) return;
         
        const timeString = currentDate();

        const entry: IChatEntry = { id: userData.webID, name: userData.name, look: userData.figure, message: event.message, timestamp: timeString, type: ChatEntryType.TYPE_CHAT };

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

    const onRoomInfoEvent = useCallback((event: RoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const session = GetRoomSession();

        if(!session || (session.roomId !== parser.data.roomId)) return;

        if(needsRoomInsert)
        {
            const chatEntry: IChatEntry = { id: parser.data.roomId, name: parser.data.roomName, timestamp: currentDate(), type: ChatEntryType.TYPE_ROOM_INFO };

            addChatEntry(chatEntry);

            setNeedsRoomInsert(false);
        }
    }, [addChatEntry, needsRoomInsert]);

    CreateMessageHook(RoomInfoEvent, onRoomInfoEvent);
    
    return null;
}
