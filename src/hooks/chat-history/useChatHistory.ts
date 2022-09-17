import { GetGuestRoomResultEvent, NewConsoleMessageEvent, RoomInviteEvent, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { ChatEntryType, ChatHistoryCurrentDate, IChatEntry, IRoomHistoryEntry, MessengerHistoryCurrentDate } from '../../api';
import { useMessageEvent, useRoomSessionManagerEvent } from '../events';

const CHAT_HISTORY_MAX = 1000;
const ROOM_HISTORY_MAX = 10;
const MESSENGER_HISTORY_MAX = 1000;

let CHAT_HISTORY_COUNTER: number = 0;
let MESSENGER_HISTORY_COUNTER: number = 0;

const useChatHistoryState = () =>
{
    const [ chatHistory, setChatHistory ] = useState<IChatEntry[]>([]);
    const [ roomHistory, setRoomHistory ] = useState<IRoomHistoryEntry[]>([]);
    const [ messengerHistory, setMessengerHistory ] = useState<IChatEntry[]>([]);
    const [ needsRoomInsert, setNeedsRoomInsert ] = useState(false);

    const addChatEntry = (entry: IChatEntry) =>
    {
        entry.id = CHAT_HISTORY_COUNTER++;

        setChatHistory(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue.push(entry);

            if(newValue.length > CHAT_HISTORY_MAX) newValue.shift();

            return newValue;
        });
    }

    const addRoomHistoryEntry = (entry: IRoomHistoryEntry) =>
    {
        setRoomHistory(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue.push(entry);

            if(newValue.length > ROOM_HISTORY_MAX) newValue.shift();

            return newValue;
        });
    }

    const addMessengerEntry = (entry: IChatEntry) =>
    {
        entry.id = MESSENGER_HISTORY_COUNTER++;

        setMessengerHistory(prevValue =>
        {
            const newValue = [ ...prevValue ];

            newValue.push(entry);

            if(newValue.length > MESSENGER_HISTORY_MAX) newValue.shift();

            return newValue;
        });
    }

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.STARTED, event => setNeedsRoomInsert(true));

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        if(!needsRoomInsert) return;

        const parser = event.getParser();

        if(roomHistory.length)
        {
            if(roomHistory[(roomHistory.length - 1)].id === parser.data.roomId) return;
        }

        addChatEntry({ id: -1, entityId: parser.data.roomId, name: parser.data.roomName, timestamp: ChatHistoryCurrentDate(), type: ChatEntryType.TYPE_ROOM_INFO, roomId: parser.data.roomId });

        addRoomHistoryEntry({ id: parser.data.roomId, name: parser.data.roomName });

        setNeedsRoomInsert(false);
    });

    useMessageEvent<NewConsoleMessageEvent>(NewConsoleMessageEvent, event =>
    {
        const parser = event.getParser();

        addMessengerEntry({ id: -1, entityId: parser.senderId, name: '', message: parser.messageText, roomId: -1, timestamp: MessengerHistoryCurrentDate(parser.secondsSinceSent), type: ChatEntryType.TYPE_IM });
    });

    useMessageEvent<RoomInviteEvent>(RoomInviteEvent, event =>
    {
        const parser = event.getParser();

        addMessengerEntry({ id: -1, entityId: parser.senderId, name: '', message: parser.messageText, roomId: -1, timestamp: MessengerHistoryCurrentDate(), type: ChatEntryType.TYPE_IM });
    });
    
    return { addChatEntry, chatHistory, roomHistory, messengerHistory };
}

export const useChatHistory = () => useBetween(useChatHistoryState);
