import { LocalizeText } from '../../../api';
import { GroupType } from './GroupType';
import { MessengerFriend } from './MessengerFriend';
import { MessengerThreadChat } from './MessengerThreadChat';
import { MessengerThreadChatGroup } from './MessengerThreadChatGroup';
import { getGroupChatData } from './Utils';

export class MessengerThread
{
    public static MESSAGE_RECEIVED: string = 'MT_MESSAGE_RECEIVED';

    private _participant: MessengerFriend;
    private _groups: MessengerThreadChatGroup[];
    private _lastUpdated: Date;
    private _unreadCount: number;

    constructor(participant: MessengerFriend, isNew: boolean = true)
    {
        this._participant = participant;
        this._groups = [];
        this._lastUpdated = new Date();
        this._unreadCount = 0;

        if(isNew)
        {
            this.addMessage(null, LocalizeText('messenger.moderationinfo'), 0, null, MessengerThreadChat.SECURITY_NOTIFICATION);

            this._unreadCount = 0;
        }
    }

    public addMessage(senderId: number, message: string, secondsSinceSent: number = 0, extraData: string = null, type: number = 0): MessengerThreadChat
    {
        const isGroupChat = (senderId < 0 && extraData);
        const userId = isGroupChat ? getGroupChatData(extraData).userId : senderId;

        const group = this.getLastGroup(userId);

        if(!group) return;

        if(isGroupChat) group.type = GroupType.GROUP_CHAT;

        const chat = new MessengerThreadChat(senderId, message, secondsSinceSent, extraData, type);

        group.addChat(chat);

        this._lastUpdated = new Date();
        this._unreadCount++;

        return chat;
    }

    private getLastGroup(userId: number): MessengerThreadChatGroup
    {
        let group = this._groups[(this._groups.length - 1)];

        if(group && (group.userId === userId)) return group;

        group = new MessengerThreadChatGroup(userId);

        this._groups.push(group);

        return group;
    }

    public setRead(): void
    {
        this._unreadCount = 0;
    }

    public get participant(): MessengerFriend
    {
        return this._participant;
    }

    public get groups(): MessengerThreadChatGroup[]
    {
        return this._groups;
    }

    public get lastUpdated(): Date
    {
        return this._lastUpdated;
    }

    public get unreadCount(): number
    {
        return this._unreadCount;
    }

    public get unread(): boolean
    {
        return this._unreadCount > 0;
    }
}
