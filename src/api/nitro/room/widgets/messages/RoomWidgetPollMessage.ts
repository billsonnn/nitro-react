import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetPollMessage extends RoomWidgetMessage
{
    public static readonly START = 'RWPM_START';
    public static readonly REJECT = 'RWPM_REJECT';
    public static readonly ANSWER = 'RWPM_ANSWER';

    private _id = -1;
    private _questionId = 0;
    private _answers: string[] = null;

    constructor(type: string, id: number)
    {
        super(type);

        this._id = id;
    }

    public get id(): number
    {
        return this._id;
    }

    public get questionId(): number
    {
        return this._questionId;
    }

    public set questionId(k: number)
    {
        this._questionId = k;
    }

    public get answers(): string[]
    {
        return this._answers;
    }

    public set answers(k: string[])
    {
        this._answers = k;
    }
}
