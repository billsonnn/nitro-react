import { MessengerChatMessage } from './MessengerChatMessage';
import { MessengerChatMessageGroup } from './MessengerChatMessageGroup';
export class MessengerChat
{
    private _friendId: number;
    private _isRead: boolean;
    private _messageGroups: MessengerChatMessageGroup[];

    constructor(friendId: number, isRead: boolean = true)
    {
        this._friendId = friendId;
        this._isRead = isRead;
        this._messageGroups = [];
    }

    public addMessage(message: MessengerChatMessage): void
    {
        if(!this.lastMessageGroup || this.lastMessageGroup.userId !== message.senderId) this._messageGroups.push(new MessengerChatMessageGroup(message.senderId));

        this.lastMessageGroup.addMessage(message);
        this._isRead = false;
    }

    public get friendId(): number
    {
        return this._friendId;
    }

    public get isRead(): boolean
    {
        return this._isRead;
    }

    public get messageGroups(): MessengerChatMessageGroup[]
    {
        return this._messageGroups;
    }

    public get lastMessageGroup(): MessengerChatMessageGroup
    {
        return this._messageGroups[this._messageGroups.length - 1];
    }
}
