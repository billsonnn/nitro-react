import { MessengerChatMessage } from './MessengerChatMessage';
import { MessengerChatMessageGroup } from './MessengerChatMessageGroup';
export class MessengerChat
{
    private _friendId: number;
    private _isRead: boolean;
    private _messageGroups: MessengerChatMessageGroup[];

    constructor(friendId: number)
    {
        this._friendId = friendId;
        this._isRead = true;
        this._messageGroups = [];
    }

    public addMessage(message: MessengerChatMessage, setAsNotRead: boolean = true, isSystem: boolean = false): void
    {
        if(!this.lastMessageGroup || this.lastMessageGroup.userId !== message.senderId || isSystem || this.lastMessageGroup.isSystem) this._messageGroups.push(new MessengerChatMessageGroup(message.senderId, isSystem));

        this.lastMessageGroup.addMessage(message);
        
        if(setAsNotRead) this._isRead = false;
    }

    public read(): void
    {
        this._isRead = true;
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
