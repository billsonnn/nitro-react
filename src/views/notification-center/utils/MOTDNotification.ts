import { NitroNotification } from './Notification';

export class MOTDNotification extends NitroNotification
{
    private _messages: string[];

    constructor(messages: string[])
    {
        super();
        this._messages = [];

        for(const message of messages) this._messages.push(message.replace(/\r\n|\r|\n/g, '<br />'));
    }

    public get messages(): string[]
    {
        return this._messages;
    }
}
