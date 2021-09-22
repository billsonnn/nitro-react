import { LocalizeText } from '../../../api';
import { MessengerFriend } from './MessengerFriend';
import { MessengerThreadChat } from './MessengerThreadChat';
import { MessengerThreadChatGroup } from './MessengerThreadChatGroup';

export class MessengerThread
{
    public static MESSAGE_RECEIVED: string = 'MT_MESSAGE_RECEIVED';

    private _participant: MessengerFriend;
    private _groups: MessengerThreadChatGroup[];
    private _lastUpdated: Date;
    private _unread: boolean;

    constructor(participant: MessengerFriend, isNew: boolean = true)
    {
        this._participant = participant;
        this._groups = [];
        this._lastUpdated = new Date();
        this._unread = false;

        if(isNew)
        {
            this.addMessage(-1, LocalizeText('messenger.moderationinfo'), 0, null, MessengerThreadChat.SECURITY_NOTIFICATION);

            this._unread = false;
        }
    }

    public addMessage(senderId: number, message: string, secondsSinceSent: number = 0, extraData: string = null, type: number = 0): MessengerThreadChat
    {
        const group = this.getLastGroup(senderId);

        if(!group) return;

        const chat = new MessengerThreadChat(senderId, message, secondsSinceSent, extraData, type);

        group.addChat(chat);

        this._lastUpdated = new Date();
        this._unread = true;

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
        this._unread = false;
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

    public get unread(): boolean
    {
        return this._unread;
    }
}
